import json

from constants import JSON_INDENT
from gear_id_alias.aliases import ALIASES

# manually copy aliases from osrs-wiki-dps and run this, then copy the json
reversed_aliases = dict()
for item_id, alias_ids in ALIASES.items():
    for alias in alias_ids:
        reversed_aliases[alias] = item_id

with open("id_aliases.json", 'w') as bis_json:
    json.dump(reversed_aliases, bis_json, indent=JSON_INDENT)
