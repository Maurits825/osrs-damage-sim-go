from dataclasses import dataclass


@dataclass()
class DpsGraphDpsData:
    label: str
    dps: list[float]


@dataclass()
class DpsGraphData:
    title: str
    x_values: range
    x_label: str
    dps_data: list[DpsGraphDpsData]
