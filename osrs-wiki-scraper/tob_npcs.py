from __future__ import annotations

import re

from util import get_ids

FILTER_NPCS = ["8384"]


class TobNpcs:
    @staticmethod
    def run(source: str, vid, version: dict[str, str], docs: dict[str, dict]) -> (dict | None, str):
        npc_version = str(version.get("version", "").strip())

        if "Xarpus" in str(version["name"]).strip():
            npc_version = str(version.get("smwname", "").strip())

        if "Health" in npc_version:
            return None, None

        ids = get_ids(version)

        npc_id = str(ids[0])
        if npc_id in FILTER_NPCS:
            return None, None

        if "id" not in version:
            print("page {} is missing an id".format(source))
            return None, None

        if len(ids) == 0:
            print("page {} is has an empty id".format(source))
            return None, None

        doc = {"__source__": source}
        tob_mode = version.get("smwname") if "Verzik" in str(version["name"]).strip() else npc_version
        attributes = str(version.get("attributes", "")).strip()
        if "Entry" in tob_mode:
            version["attributes"] = attributes + ",TobEntryMode"
        elif "Normal" in tob_mode:
            version["attributes"] = attributes + ",TobNormalMode"
        elif "Hard" in tob_mode:
            version["attributes"] = attributes + ",TobHardMode"
        else:
            version["attributes"] = attributes + ",TobNormalMode"

        if npc_id in docs:
            npc_id += "_" + str(vid).replace("-", "")
        docs[npc_id] = doc

        name = version["name"].strip()
        if "Prinkipas" in name:
            name += " " + str(version["version"]).strip()
            version["attributes"] = "TobHardMode"
        elif "Small" in npc_version:
            name += " " + "(small)"
        elif "Big" in npc_version:
            name += " " + "(big)"
        elif "Verzik" in name:
            name += " (" + re.sub("^.*phase ", "p", str(version.get("smwname", "").strip().lower())) + ")"

        return doc, name
