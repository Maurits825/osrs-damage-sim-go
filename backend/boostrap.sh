#!/bin/sh
export PYTHONUNBUFFERED=1
export FLASK_APP=damage_sim_server.py
. venv/Scripts/activate
flask run -h 0.0.0.0
