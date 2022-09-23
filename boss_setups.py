from weapons.claw_spec import ClawSpec
from weapons.scythe import Scythe
from weapons.weapon import Weapon
from weapons.zcb_spec import ZcbSpec

boss_setups = {
    "Zebak": {
        "Health": 580,
        "Zcb claws tbow": [
            ZcbSpec(110, 92.96, 5, 2),
            ClawSpec(45, 64.55, 4, 1),
            Weapon(81, 87.93, 5, name="T bow")
        ],
        "Zcb 3 claws tbow": [
            ZcbSpec(110, 92.96, 5, 1),
            ClawSpec(45, 64.55, 4, 3),
            Weapon(81, 87.93, 5, name="T bow")
        ]
    },
    "Ba-ba": {
        "Health": 380,
        "Zcb claw scythe": [
            ZcbSpec(110, 86.61, 5, 1),
            ClawSpec(40, 55.25, 4, 1),
            Scythe(45, 66.49, 5)
        ],
        "Claw scythe": [
            ClawSpec(40, 55.25, 4, 2),
            Scythe(45, 66.49, 5)
        ]
    },
    "Kephri": {
        "Health": 80,
        "Scythe crush": [
            Scythe(45, 60.49, 5)
        ],
        "Rapier": [
            Weapon(50, 82.60, 4, name="Rapier")
        ],
    }
}
