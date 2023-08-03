from dataclasses import dataclass


@dataclass()
class CoxScalingInput:
    party_size: int
    is_challenge_mode: bool
    max_combat: int = 126
    max_hitpoints: int = 99
    average_mining: int = 99
