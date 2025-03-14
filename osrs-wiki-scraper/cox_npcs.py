from __future__ import annotations

from util import get_ids

FILTER_NPCS = ["7526"]


class CoxNpcs:
    @staticmethod
    def run(source: str, vid, version: dict[str, str], docs: dict[str, str | bool]) -> (dict | None, str):
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

        npc_version = str(version.get("version", "").strip())
        if "Challenge Mode" in npc_version:
            return None, None

        doc = {"__source__": source}

        if npc_id in docs:
            npc_id += "_" + str(vid)
        docs[npc_id] = doc

        npc_version = str(version.get("version", "").strip())
        name = str(version["name"]).strip()
        if not any(filter_str in npc_version for filter_str in ["Normal", "claw", "Enraged"]):
            name += " " + str(version["version"]).strip()

        name = name.replace('(', '').replace(')', '').strip()

        if npc_id == "7550":
            name = "Great Olm Right claw (mage)"
        elif npc_id == "7552":
            name = "Great Olm Left claw (melee)"

        return doc, name
