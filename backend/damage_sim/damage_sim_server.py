from flask import Flask, request, jsonify
from flask_compress import Compress
from flask_cors import CORS

from damage_sim.damage_sim_runner import DamageSimRunner
from damage_sim.damage_sim_validation import DamageSimValidation
from input_setup.input_setup_converter import InputSetupConverter

app = Flask(__name__)
CORS(app, origins=["http://localhost:4200", "https://maurits825.github.io"])

app.config["COMPRESS_REGISTER"] = False  # disable default compression of all eligible requests
compress = Compress()
compress.init_app(app)

damage_sim_runner = DamageSimRunner()


@app.route("/status", methods=["GET"])
def get_status():
    status = "damage-sim server is running!"
    return {"status": status}


@app.route("/run-damage-sim", methods=["POST"])
def run_damage_sim():
    json_request = request.get_json()

    error = DamageSimValidation.validate_setup(json_request)
    if error:
        return {"error": error}

    input_setup = InputSetupConverter.get_input_setup(json_request)
    damage_sim_results = damage_sim_runner.run(input_setup)

    return jsonify(damage_sim_results)
