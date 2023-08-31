from model.damage_sim_results.dps_grapher_results import DpsGrapherResults
from model.input_setup.dps_grapher_input import DpsGrapherInput


class DpsGrapher:
    def __init__(self):
        pass

    def run(self, dps_grapher_input: DpsGrapherInput) -> DpsGrapherResults:
        return DpsGrapherResults(
            graph="foo"
        )
