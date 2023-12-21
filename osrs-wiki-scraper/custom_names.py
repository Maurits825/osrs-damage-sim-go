CUSTOM_NAME_MAP = {
    "8060": "Vorkath (Quest)",
    "8058": "Vorkath (Quest)",

    "2042": "Zulrah (Serpentine/Ranged)",
    "2043": "Zulrah (Magma/Melee)",
    "2044": "Zulrah (Tanzanite/Mage)",

    "12077": "Phantom Muspah (Ranged)",
    "12078": "Phantom Muspah (Melee)",
    "12079": "Phantom Muspah (Shielded)",

    "12215": "The Leviathan (Quest)",
    "12219": "The Leviathan (Quest)",

    "12193": "Duke Sucellus (Quest)",
    "12194": "Duke Sucellus (Quest)",
    "12195": "Duke Sucellus (Quest)",

    "12206": "The Whisperer (Quest)",
    "12207": "The Whisperer (Quest)",

    "12224": "Vardorvis (Quest)",
    "12228": "Vardorvis (Quest)",

    "963": "Kalphite Queen (Crawling)",
    "965": "Kalphite Queen (Airborne)",

    "12223_1": "Vardorvis (Awakened)",
    "12426_1": "Vardorvis (Awakened)",

    "12204_1": "The Whisperer (Awakened)",
    "12205_1": "The Whisperer (Awakened)",

    "12214_1": "The Leviathan (Awakened)",

    "12166_1": "Duke Sucellus (Awakened)",
    "12167_1": "Duke Sucellus (Awakened)",
    "12191_1": "Duke Sucellus (Awakened)",
    "12192_1": "Duke Sucellus (Awakened)",
}


class CustomNames:
    @staticmethod
    def get_custom_name(version: dict[str, str]):
        if "id" not in version:
            return None

        ids = [id for id in map(lambda id: id.strip(), str(version["id"]).split(",")) if id != ""]

        if len(ids) == 0:
            return None

        npc_id = ids[0]
        if npc_id:
            return CUSTOM_NAME_MAP.get(npc_id, None)
        else:
            return None
