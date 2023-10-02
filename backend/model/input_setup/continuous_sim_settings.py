from dataclasses import dataclass


@dataclass()
class ContinuousSimSettings:
    enabled: bool
    kill_count: int = 1
    death_charge: bool = False
    respawn_ticks: int = 0
