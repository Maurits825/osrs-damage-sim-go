#!/bin/sh
export PYTHONUNBUFFERED=1

if [ "$1" != "--skip-scraper" ]; then
    echo "Running OSRS wiki scraper ..."
    python osrs_wiki_scraper.py
else
    echo "Skipping OSRS wiki scraper ..."
fi

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
cp data_cache/items-dmg-sim.json ../backend/osrs-dmg-sim/wikidata/json-data/items-dmg-sim.json
cp data_cache/npcs-dmg-sim.json ../backend/osrs-dmg-sim/wikidata/json-data/npcs-dmg-sim.json
cp data_cache/special_attack.json ../backend/osrs-dmg-sim/wikidata/json-data/special_attack.json
cp data_cache/bis_graph.json ../backend/osrs-dmg-sim/wikidata/json-data/bis_graph.json

echo "Done!"
