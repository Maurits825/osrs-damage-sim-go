from dataclasses import dataclass


@dataclass()
class TimeSimStats:
    average: str
    maximum: str
    minimum: str
    most_frequent: str

    chance_to_kill: str


@dataclass()
class SimStats:
    average: float
    maximum: float
    minimum: float
    most_frequent: int

    chance_to_kill: int
