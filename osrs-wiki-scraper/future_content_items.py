import re
import traceback

import mwparserfromhell as mw

import api
import util
from constants import SLOT_IDS


def get_future_items():
    stats = {}
    item_id = 1_000_000  # todo get highest id of normal items?

    item_pages = api.query_category("Raging Echoes League")
    for name, page in item_pages.items():
        if name.startswith("Category:") or "Areas" in name:
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

                # refactor this
                doc = dict()
                doc["__source__"] = name + str(vid)
                stats[item_id] = doc
                item_id += 1

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
                doc['futureContent'] = True

        except (KeyboardInterrupt, SystemExit):
            raise
        except:
            print("Item {} failed:".format(name))
            traceback.print_exc()

    return stats
