import json

from wiki_data import WikiData


def fix():
    with open("tests/resources/input_setups.json") as f:
        input_setups = json.load(f)
        new_input_setups = {}
        for setup_name in input_setups:
            input_setup = input_setups[setup_name]
            global_settings = {
                "iterations": input_setup["iterations"],
                "npcId": input_setup["npcId"],
                "raidLevel": input_setup["raidLevel"],
                "pathLevel": input_setup["pathLevel"],
                "teamSize": input_setup["teamSize"],
            }

            new_input_setups[setup_name] = {
                "expectedDps": input_setup["expectedDps"],
                "globalSettings": global_settings,
                "gearInputSetups": input_setup["gearInputSetups"],
            }

            for gear_input_setup in input_setup["gearInputSetups"]:
                for gear_setup in gear_input_setup:
                    new_gear = {}
                    for gear_id in gear_setup["gear"]:
                        item = WikiData.items_json[str(gear_id)]
                        new_gear[str(item["slot"])] = {"id": gear_id}

                    gear_setup["gear"] = new_gear
                    gear_setup["setupName"] = gear_setup["name"]
                    gear_setup["combatStats"]["hitpoints"] = 99
                    del gear_setup["weapon"]
                    del gear_setup["name"]

    with open("tests/resources/input_setups.json", "w") as f:
        f.write(json.dumps(new_input_setups))


fix()
