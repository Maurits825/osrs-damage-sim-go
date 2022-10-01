from flask import Flask, request
from flask_cors import CORS

from rl_gear_input import RlGearInput
from wiki_data import WikiData

app = Flask(__name__)
CORS(app)


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
            for item in gear_slot_items:
                if item["id"] == item_id:
                    gear[slot] = {
                        "name": item["name"],
                        "id": item_id
                    }

    return gear
