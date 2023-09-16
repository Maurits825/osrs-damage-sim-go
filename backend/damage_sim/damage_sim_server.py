import requests
from flask import Flask, request, jsonify, abort
from flask_compress import Compress
from flask_cors import CORS

from damage_sim.damage_sim_graph import DamageSimGraph
from damage_sim.damage_sim_runner import DamageSimRunner
from damage_sim.damage_sim_validation import DamageSimValidation
from damage_sim.dps_grapher import DpsGrapher
from input_setup.input_setup_converter import InputSetupConverter
from model.input_setup.mode import Mode

HIGHSCORE_URL = "https://services.runescape.com/m=hiscore_oldschool/index_lite.json"


app = Flask(__name__)
CORS(app, origins=["http://localhost:4200", "https://maurits825.github.io"])

app.config["COMPRESS_REGISTER"] = False  # disable default compression of all eligible requests
compress = Compress()
compress.init_app(app)

damage_sim_graph = DamageSimGraph()
damage_sim_runner = DamageSimRunner(damage_sim_graph)
dps_grapher = DpsGrapher(damage_sim_graph)


@app.route("/status", methods=["GET"])
def get_status():
    status = "damage-sim server is running!"
    return {"status": status}


@app.route("/run-damage-sim", methods=["POST"])
def run_damage_sim():
    json_request = request.get_json()

    error = DamageSimValidation.validate_setup(json_request, Mode.DamageSim)
    if error:
        return {"error": error}

    input_setup = InputSetupConverter.get_input_setup(json_request)
    damage_sim_results = damage_sim_runner.run(input_setup)

    return jsonify(damage_sim_results)


@app.route("/run-dps-calc", methods=["POST"])
def run_dps_calc():
    json_request = request.get_json()

    error = DamageSimValidation.validate_setup(json_request, Mode.DpsCalc)
    if error:
        return {"error": error}

    input_setup = InputSetupConverter.get_input_setup(json_request)

    dps_calc_results = damage_sim_runner.run_dps_calc(input_setup)

    return jsonify(dps_calc_results)


@app.route("/run-dps-grapher", methods=["POST"])
def run_dps_grapher():
    json_request = request.get_json()

    error = DamageSimValidation.validate_dps_grapher_input(json_request)
    if error:
        return {"error": error}

    dps_grapher_input = InputSetupConverter.get_dps_grapher_input(json_request)
    dps_grapher_results = dps_grapher.run(dps_grapher_input)

    return jsonify(dps_grapher_results)


@app.route("/lookup-highscore", methods=["GET"])
def lookup_highscore():
    rsn = request.args.get("rsn")
    response = requests.get(HIGHSCORE_URL + "?player=" + rsn)
    if response.status_code == 404:
        abort(404)

    skills = response.json()["skills"]

    combat_stats = {}
    for skill in skills:
        skill_name = skill["name"].lower()
        combat_stats[skill_name] = skill["level"]

    return jsonify(combat_stats)
