from dataclasses import dataclass


@dataclass()
class TimeSimStats:
    average: str
    maximum: str
    minimum: str
    most_frequent: str

    chance_to_kill: list[str]

    label: str = None


@dataclass()
class SimStats:
    average: float
    maximum: int
    minimum: int
    most_frequent: int

    chance_to_kill: list

    label: str = None
