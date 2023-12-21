import json


def fix():
    file_name = "../resources/input_setups.json"
    #file_name = "../resources/spec_input_setups.json"
    #file_name = "../resources/performance_test_input_setups.json"
    with open(file_name) as f:
        input_setups = json.load(f)
        new_input_setups = {}
        for setup_name in input_setups:
            old_input_setup = input_setups[setup_name]
            new_input_setups[setup_name] = old_input_setup
            new_input_setups[setup_name]["globalSettings"]["continuousSimSettings"] = {
                "enabled": False
            }

    with open(file_name, "w") as f:
        f.write(json.dumps(new_input_setups))


def add_new_field():
    files = [
        "../resources/input_setups.json",
        "../resources/spec_input_setups.json",
        "../resources/performance_test_input_setups.json"
    ]

    for file in files:
        with open(file) as f:
            input_setups = json.load(f)
            new_input_setups = {}
            for setup_name in input_setups:
                old_input_setup = input_setups[setup_name]
                new_input_setups[setup_name] = old_input_setup
                new_input_setups[setup_name]["globalSettings"]["overlyDraining"] = False

        with open(file, "w") as f:
            f.write(json.dumps(new_input_setups))


# fix()
add_new_field()
