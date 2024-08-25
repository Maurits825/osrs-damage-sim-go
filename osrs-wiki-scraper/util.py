import collections
import json
import re
from typing import *

from model.attack_type import AttackType
from model.weapon_category import WeaponCategory

VERSION_EXTRACTOR = re.compile(r"(.*?)([0-9]+)?$")


def each_version(template_name: str, code, include_base: bool = False,
                 mergable_keys: List[str] = None) -> Iterator[Tuple[int, Dict[str, Any]]]:
    """
    each_version is a generator that yields each version of an infobox
    with variants, such as {{Infobox Item}} on [[Ring of charos]]
    """
    if mergable_keys is None:
        mergable_keys = ["version", "image", "caption"]
    infoboxes = code.filter_templates(matches=lambda t: t.name.matches(template_name))
    if len(infoboxes) < 1:
        return
    for infobox in infoboxes:
        base: Dict[str, str] = {}
        versions: Dict[int, Dict[str, str]] = {}
        for param in infobox.params:
            matcher = VERSION_EXTRACTOR.match(str(param.name).strip())
            if matcher is None:
                raise AssertionError()
            primary = matcher.group(1)
            dic = base
            if matcher.group(2) != None:
                version = int(matcher.group(2))
                if not version in versions:
                    versions[version] = {}
                dic = versions[version]
            dic[primary] = param.value
        if len(versions) == 0:
            yield (-1, base)
        else:
            all_mergable = True
            for versionID, versionDict in versions.items():
                for key in versionDict:
                    if not key in mergable_keys:
                        all_mergable = False
            if all_mergable:
                yield (-1, base)
            else:
                if include_base:
                    yield (-1, base)
                for versionID, versionDict in versions.items():
                    yield (versionID, {**base, **versionDict})


def write_json(name: str, minName: str, docs: Dict[Any, Dict[str, Any]]):
    # Modification here to preserve names in minified dict
    items = []
    for (id, doc) in docs.items():
        named = {k: v for (k, v) in doc.items() if not k.startswith("__")}
        items.append((id, named))
    items.sort(key=lambda k: int(k[0]))

    item_dict = collections.OrderedDict([(k, v) for (k, v) in items])
    with open(name, "w+") as fi:
        json.dump(item_dict, fi, indent=1)

    with open(minName, "w+") as fi:
        json.dump(item_dict, fi, separators=(",", ":"))


known_invalid_ids: dict[str, str] = {}


def get_ids(version):
    return [id_value for id_value in map(
        lambda id_value: id_value.strip(), str(version["id"]).split(",")) if id_value != "" and id_value.isdigit()]


def get_doc_for_id_string(source: str, version: Dict[str, str], docs: Dict[str, Dict],
                          allow_duplicates: bool = False) -> Optional[Dict]:
    if not "id" in version:
        print("page {} is missing an id".format(source))
        return None

    ids = get_ids(version)

    if len(ids) == 0:
        # print("page {} is has an empty id".format(source))
        return None

    doc = {}
    doc["__source__"] = source
    for id in ids:
        if id in docs:
            if "Awakened" in version.get("version", "") or "Awakened" in version.get("smwname", ""):
                id = id + '_1'
                version["id"] = id

            else:
                print("skip - name: " + source + ", id: " + id)
                return None

        docs[id] = doc

    return doc


def copy(name: Union[str, Tuple[str, str]],
         doc: Dict,
         version: Dict[str, Any],
         convert: Callable[[Any], Any] = lambda x: x) -> bool:
    src_name = name if isinstance(name, str) else name[0]
    dst_name = name if isinstance(name, str) else name[1]
    if not src_name in version:
        return False
    strval = str(version[src_name]).strip()
    if strval == "":
        return False
    newval = convert(strval)
    if not newval:
        return False
    doc[dst_name] = newval
    return True


def has_template(name: str, code) -> bool:
    return len(code.filter_templates(matches=lambda t: t.name.matches(name))) != 0


def get_attack_style_and_type(item):
    weapon_category_name = item.get("weaponCategory", None)
    attack_styles = None
    attack_type = None

    if weapon_category_name:
        weapon_category = WeaponCategory[weapon_category_name]

        attack_styles = [style.name for style in weapon_category.value]

        if weapon_category.value[-1].attack_type == AttackType.MAGIC:
            attack_type = "magic"
        elif weapon_category.value[0].attack_type in [AttackType.STAB, AttackType.SLASH, AttackType.CRUSH]:
            attack_type = "melee"
        elif weapon_category.value[0].attack_type == AttackType.RANGED:
            attack_type = "ranged"

    return attack_styles, attack_type


def is_filtered_item(item, item_id):
    # teleport charges
    if re.match(r".*\(\d+\)", item["name"]):
        return "Shayzien" not in item["name"]

    # imbued ring charges
    if re.match(r".*\(i\d+\)", item["name"]):
        return True

    # heraldic helms
    if re.match(r".*\(h\d+\)", item["name"]):
        return "(h1)" not in item["name"]

    # team capes
    if re.match(r"Team-\d+ cape", item["name"]):
        return "Team-1 cape" not in item["name"]

    # inactive bowfa id
    if item_id == "25862":
        return True

    # no r str blowpipe
    if item_id == "12924":
        return True

    # uncharged serp
    if item_id == "12929":
        return True

    if "(uncharged)" in item["name"]:
        return True

    if "Wilderness Wars" in item["name"]:
        return True

    if "unobtainable item" in item["name"]:
        return True

    if "(Last Man Standing)" in item["name"]:
        return True

    if "(deadman)" in item["name"]:
        return True

    if "corrupted" in item["name"].lower():
        return True

    # heraldic symbol items
    if any(symbol in item["name"] for symbol in
           ["(Asgarnia)", "(Dorgeshuun)", "(Dragon)", "(Fairy)", "(Guthix)", "(HAM)", "(Horse)", "(Jogre)",
            "(Kandarin)", "(Misthalin)", "(Money)", "(Saradomin)", "(Skull)", "(Varrock)", "(Zamorak)"]):
        return True

    # graceful variants
    if any(symbol in item["name"] for symbol in
           ["(Arceuus)", "(Piscarilius)", "(Lovakengj)", "(Shayzien)", "(Hosidius)", "(Agility Arena)"]):
        return True

    # barrows item degradation
    if any(number in item["name"] for number in ["0", "25", "50", "75", "100"]):
        if any(barrows in item["name"].lower() for barrows in
               ["ahrim", "dharok", "guthan", "karil", "torag", "verac"]):
            return True

    # crystal recolors
    if any(symbol in item["name"] for symbol in
           ["(Amlodd)", "(Crwys)", "(Cadarn)", "(Trahaearn)", "(Iorwerth)", "(Ithell)", "(Hefin)", "(Meilyr)"]):
        return True

    # nightmare zone items
    if "(nz)" in item["name"]:
        return True

    # weapon with no attack styles, eg 2h axes
    if item["slot"] == 3 and "weaponCategory" not in item:
        return True

    return False
