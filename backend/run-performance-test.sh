#!/bin/sh
export PYTHONUNBUFFERED=1
export FLASK_APP=damage_sim_server.py
echo "Activating venv ..."
. venv/Scripts/activate
echo "Running performance tests ..."
python -m cProfile -o performance.prof tests/performance_test.py
snakeviz performance.prof
