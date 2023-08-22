CUSTOM_NAME_MAP = {
    "8060": "Vorkath (quest)",
    "8058": "Vorkath (quest)",

    "2042": "Zulrah (Serpentine/Ranged)",
    "2043": "Zulrah (Magma/Melee)",
    "2044": "Zulrah (Tanzanite/Mage)",

    "12077": "Phantom Muspah (Ranged)",
    "12078": "Phantom Muspah (Melee)",
    "12079": "Phantom Muspah (Shielded)",

    "12215": "The Leviathan (quest)",
    "12219": "The Leviathan (quest)",

    "12193": "Duke Sucellus (quest)",
    "12194": "Duke Sucellus (quest)",
    "12195": "Duke Sucellus (quest)",

    "12206": "The Whisperer (quest)",
    "12207": "The Whisperer (quest)",

    "12224": "Vardorvis (quest)",
    "12228": "Vardorvis (quest)",

    "963": "Kalphite Queen (Crawling)",
    "965": "Kalphite Queen (Airborne)"
}


class CustomNames:
    @staticmethod
    def get_custom_name(version: dict[str, str]):
        if "id" not in version:
            return None

        ids = [id for id in map(lambda id: id.strip(), str(version["id"]).split(",")) if id != "" and id.isdigit()]

        if len(ids) == 0:
            return None

        npc_id = ids[0]
        if npc_id:
            return CUSTOM_NAME_MAP.get(npc_id, None)
        else:
            return None
