import json
import re
import traceback

import mwparserfromhell as mw

import api
from constants import CACHE_DATA_FOLDER
from generate_web_app_data import JSON_INDENT

name_pattern = r'\[\[(.*?)\]\]'


def run():
    slang_dictionary = {}

    slang_letter_pages = api.query_category("Slang dictionary")
    for name, page in slang_letter_pages.items():
        if name == "Slang dictionary" or name == "Slang dictionary/Numbers":
            continue

        try:
            code = mw.parse(page, skip_style_tags=True)
            table = code.filter_tags(matches=lambda node: node.tag == 'table')[0]

            for row in table.contents.nodes[2:]:
                cells = row.contents
                abbreviations = cells.nodes[0].contents.strip().split(', ')
                actual_names = re.findall(name_pattern, cells.nodes[1].contents.strip())
                for name_value in actual_names:
                    for actual_name in name_value.split('|'):
                        if actual_name in slang_dictionary:
                            for abb in abbreviations:
                                slang_dictionary[actual_name].append(abb)
                        else:
                            slang_dictionary[actual_name] = abbreviations

        except (KeyboardInterrupt, SystemExit):
            raise
        except:
            print("Word {} failed:".format(name))
            traceback.print_exc()

    with open(CACHE_DATA_FOLDER / "abbreviations.json", 'w') as slang_dictionary_json:
        json.dump(slang_dictionary, slang_dictionary_json, indent=JSON_INDENT)
