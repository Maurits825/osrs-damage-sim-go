import json

GEAR_JSON = "./setups/gear.json"


class GearJson:
    @staticmethod
    def load_gear():
        with open(GEAR_JSON) as gear_file:
            return json.load(gear_file)

    @staticmethod
    def update_gear(name, gear_list):
        gear = GearJson.load_gear()
        if name in gear:
            raise NameError("Name already exists in gear json")
        gear[name] = gear_list

        with open(GEAR_JSON, 'w') as json_file:
            json.dump(gear, json_file)
