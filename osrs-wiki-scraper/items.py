import re
import traceback

import mwparserfromhell as mw

import api
import util
from constants import CACHE_DATA_FOLDER, SLOT_IDS
from future_content_items import get_future_items


def run():
    stats = {}

    item_pages = api.query_category("Items")
    for name, page in item_pages.items():
        if name.startswith("Category:"):
            continue

        try:
            code = mw.parse(page, skip_style_tags=True)

            equips = {}
            for (vid, version) in util.each_version("Infobox Bonuses", code, include_base=True):
                doc = {}
                equips[vid] = doc

                if "slot" not in version:
                    continue

                slotID = str(version["slot"]).strip().lower()
                if slotID in SLOT_IDS:
                    doc["slot"] = SLOT_IDS[slotID]
                    if slotID == "2h":
                        doc["is2h"] = True
                else:
                    print("Item {} has unknown slot {}".format(name, slotID))
                    continue

                for key in [
                    "astab", "aslash", "acrush", "amagic", "arange", "dstab", "dslash", "dcrush", "dmagic", "drange",
                    "str",
                    "rstr", "prayer", ("speed", "aspeed")
                ]:
                    try:
                        util.copy(key, doc, version, lambda x: int(x))
                    except ValueError:
                        print("Item {} has an non integer {}".format(name, key))
                for key in ["mdmg"]:
                    try:
                        util.copy(key, doc, version, lambda x: float(x))
                    except ValueError:
                        print("Item {} has an non float {}".format(name, key))

            for (vid, version) in util.each_version("Infobox Item", code,
                                                    mergable_keys=None if len(equips) <= 1 else []):
                if "removal" in version and not str(version["removal"]).strip().lower() in ["", "no", "n/a"]:
                    continue

                equipable = "equipable" in version and "yes" in str(version["equipable"]).strip().lower()
                equipVid = vid if vid in equips else -1 if -1 in equips else None
                if not equipable or equipVid is None:
                    continue

                doc = util.get_doc_for_id_string(name + str(vid), version, stats)
                if doc == None:
                    continue

                util.copy("name", doc, version)
                if not "name" in doc:
                    doc["name"] = name

                doc["name"] = name

                util.copy("quest", doc, version, lambda x: x.lower() != "no")

                equipable = "equipable" in version and "yes" in str(version["equipable"]).strip().lower()

                if "weight" in version:
                    strval = str(version["weight"]).strip()
                    strval = re.sub(r"<!--.*?-->", "", strval)
                    if strval.endswith("kg"):
                        strval = strval[:-2].strip()
                    if strval != "":
                        floatval = float(strval)
                        if floatval != 0:
                            doc["weight"] = floatval

                if equipVid != None and (equipable or not "broken" in version["name"].lower()):
                    if not equipable:
                        print("Item {} has Infobox Bonuses but not equipable".format(name))
                        continue
                    doc["equipable"] = True
                    for k in equips[equipVid]:
                        doc[k] = equips[equipVid][k]
                else:
                    continue

                for (vid, version) in util.each_version("CombatStyles", code):
                    doc['weaponCategory'] = version[''].upper().replace(' ', '_').replace('2H_SWORD',
                                                                                          'TWO_HANDED_SWORD')

        except (KeyboardInterrupt, SystemExit):
            raise
        except:
            print("Item {} failed:".format(name))
            traceback.print_exc()

    # TODO comment for out for now, need a better/generic way to handle this
    # future_items = get_future_items()
    # stats.update(future_items)
    util.write_json(CACHE_DATA_FOLDER / "items-dmg-sim.json", CACHE_DATA_FOLDER / "items-dmg-sim.min.json", stats)
