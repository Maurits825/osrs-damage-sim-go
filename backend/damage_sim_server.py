from flask import Flask, request
from flask_cors import CORS

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
