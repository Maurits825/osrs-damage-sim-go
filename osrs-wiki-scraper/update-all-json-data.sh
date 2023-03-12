#!/bin/sh
export PYTHONUNBUFFERED=1

echo "Activating venv ..."
. venv/Scripts/activate

echo ""
echo "Running osrs wiki scraper ..."
echo "mock data"
#python osrs_wiki_scraper.py

echo ""
echo "Generating web app data ..."
echo "mock data"
#python generate_web_app_data.py

echo ""
echo "Copying json data to web app assets ..."
cp data_cache/gear_slot_items.json ../frontend/osrs-damage-sim/src/assets/json_data/gear_slot_items.json
cp data_cache/unique_npcs.json ../frontend/osrs-damage-sim/src/assets/json_data/unique_npcs.json

echo ""
echo "Copying json data to dmg-sim-service ..."
cp data_cache/items-dmg-sim.min.json ../backend/wiki_data/items-dmg-sim.min.json
cp data_cache/npcs-dmg-sim.min.json ../backend/wiki_data/npcs-dmg-sim.min.json
