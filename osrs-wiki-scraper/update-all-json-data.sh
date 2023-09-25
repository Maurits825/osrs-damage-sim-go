#!/bin/sh
export PYTHONUNBUFFERED=1

echo "Running osrs wiki scraper ..."
python osrs_wiki_scraper.py

echo ""
echo "Generating web app data ..."
python generate_web_app_data.py

echo ""
echo "Copying json data to web app assets ..."
cp data_cache/gear_slot_items.json ../frontend/osrs-damage-sim/src/assets/json_data/gear_slot_items.json
cp data_cache/unique_npcs.json ../frontend/osrs-damage-sim/src/assets/json_data/unique_npcs.json
cp data_cache/abbreviations.json ../frontend/osrs-damage-sim/src/assets/json_data/abbreviations.json

echo ""
echo "Copying json data to dmg-sim-service ..."
cp data_cache/items-dmg-sim.json ../backend/wiki_data/items-dmg-sim.json
cp data_cache/npcs-dmg-sim.json ../backend/wiki_data/npcs-dmg-sim.json
cp data_cache/special_attack.json ../backend/wiki_data/special_attack.json

echo "Done!"
