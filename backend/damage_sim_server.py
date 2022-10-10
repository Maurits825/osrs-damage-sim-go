from flask import Flask, request
from flask_cors import CORS

from damage_sim import DamageSim
from gear_json import GearJson
from gear_setup_input import GearSetupInput
from model.attack_style.weapon_category import WeaponCategory
from rl_gear_input import RlGearInput
from wiki_data import WikiData

app = Flask(__name__)
CORS(app)

damage_sim = DamageSim()


@app.route("/status", methods=["GET"])
def get_status():
    status = "damage-sim server is running!"
    return status


@app.route("/gear-slot-items", methods=["GET"])
def get_gear_slot_items():
    return WikiData().gear_slot_items


@app.route("/rl-gear", methods=["GET"])
def get_rl_gear():
    rl_gear_list = RlGearInput.get_gear()

    gear = {}
    for item_id in rl_gear_list:
        for slot, gear_slot_items in WikiData.gear_slot_items.items():
            if str(item_id) in gear_slot_items:
                gear[slot] = {
                    "name": gear_slot_items[str(item_id)]["name"],
                    "id": item_id
                }

    return gear


@app.route("/gear-setups", methods=["GET"])
def get_gear_setups():
    gear_setups = {}

    for name, item_ids in GearJson.load_gear().items():
        gear_setups[name] = {}
        for item_id in item_ids:
            for slot, gear_slot_items in WikiData.gear_slot_items.items():
                if str(item_id) in gear_slot_items:
                    gear_setups[name][slot] = {
                        "name": gear_slot_items[str(item_id)]["name"],
                        "id": item_id
                    }

    return gear_setups


@app.route("/attack-style/<item_id_str>", methods=["GET"])
def get_attack_style(item_id_str):
    attack_styles = []
    item_id = int(item_id_str)

    if item_id == 0:
        for style in WeaponCategory.UNARMED.value:
            attack_styles.append(style.name)
    else:
        item = WikiData.get_item(item_id)
        for style in item.weapon_category.value:
            attack_styles.append(style.name)

    return attack_styles


@app.route("/npcs", methods=["GET"])
def get_npcs():
    return WikiData().npcs_json


@app.route("/run-damage-sim", methods=["POST"])
def run_damage_sim():
    json_request = request.get_json()

    input_setup = GearSetupInput.get_input_setup(json_request)
    text_results = damage_sim.run(json_request["iterations"], input_setup)

    return {"textResults": text_results}
