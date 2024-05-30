import traceback

import mwparserfromhell as mw

import api
import util
from constants import CACHE_DATA_FOLDER
from cox_npcs import CoxNpcs
from custom_names import CustomNames
from tob_npcs import TobNpcs

# Modification here to include many more attributes
npc_trait_keys = ["hitpoints", "att", "str", "def", "mage", "range",
                  "attbns", "strbns", "defbns", "amagic", "mbns", "arange", "rngbns",
                  "dstab", "dslash", "dcrush", "dmagic", "drange", "dlight", "dstandard", "dheavy",
                  "combat", "size", "respawn"]

FILTER_NPCS = ["4303", "4304", "6500", "6501"]


def run():
    npcs = {}

    npc_pages = api.query_category("Monsters")
    for name, page in npc_pages.items():
        if name.startswith("Category:"):
            continue

        try:
            code = mw.parse(page, skip_style_tags=True)

            for (vid, version) in util.each_version("Infobox Monster", code):
                if "removal" in version and not str(version["removal"]).strip().lower() in ["", "no"]:
                    continue

                try:
                    npc_id = str(util.get_ids(version)[0])
                except:
                    pass
                else:
                    if npc_id in FILTER_NPCS:
                        continue

                is_cox = util.has_template("Chambers of Xeric", code)
                is_tob = util.has_template("Theatre of Blood", code)

                if is_cox:
                    doc, custom_name = CoxNpcs.run(name + str(vid), vid, version, npcs)
                elif is_tob:
                    doc, custom_name = TobNpcs.run(name + str(vid), vid, version, npcs)
                else:
                    doc = util.get_doc_for_id_string(name + str(vid), version, npcs)
                    custom_name = CustomNames.get_custom_name(version)

                if not doc:
                    continue

                util.copy("name", doc, version)
                if "name" not in doc:
                    doc["name"] = name

                if "attributes" in version:
                    attrs = [x.strip() for x in version["attributes"].split(",") if x.strip()]
                    for attr in attrs:
                        doc[f"is{attr[0].upper()}{attr[1:]}"] = True

                if "cat" in version and version["cat"].strip() == "Scabarites":
                    doc["isKalphite"] = True

                if is_cox or is_tob or custom_name:
                    doc["name"] = custom_name

                for key in npc_trait_keys:
                    try:
                        util.copy(key, doc, version, lambda x: int(x))
                    except ValueError:
                        pass

                if "Vardorvis" in doc["name"] and "def" not in doc:
                    doc["def"] = int(version["def"].strip()[0:3])
                # print("NPC {} has an non integer {}".format(name, key))

        except (KeyboardInterrupt, SystemExit):
            raise
        except:
            print("NPC {} failed:".format(name))
            traceback.print_exc()

    util.write_json(CACHE_DATA_FOLDER / "npcs-dmg-sim.json", CACHE_DATA_FOLDER / "npcs-dmg-sim.min.json", npcs)
