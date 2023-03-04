import json

from wiki_data import WikiData


class GearSetupPreset:
    gear_setup_presets = json.load(open("./gear_setup_presets_data/gear.json"))

    @staticmethod
    def get_gear_presets_with_icons():
        gear_presets = []
        all_items = WikiData.items_json
        for gear_preset in GearSetupPreset.gear_setup_presets:
            gear_slot = all_items[str(gear_preset["iconId"])]["slot"]
            for item in WikiData.get_gear_slot_items()[str(gear_slot)]:
                if item["id"] == gear_preset["iconId"]:
                    gear_presets.append({
                        "name": gear_preset["name"],
                        "gearIds": gear_preset["gearIds"],
                        "icon": item["icon"],
                        "attackType": gear_preset["attackType"]
                    })

        return gear_presets
