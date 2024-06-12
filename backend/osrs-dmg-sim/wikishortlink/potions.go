package wikishortlink

import "github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/dpscalc"

var potionsBoostId = map[dpscalc.PotionBoost]int{
	dpscalc.AncientBrew:        0,
	dpscalc.AttackBoost:        1,
	dpscalc.ForgottenBrew:      2,
	dpscalc.ImbuedHeart:        3,
	dpscalc.MagicBoost:         4,
	dpscalc.CombatBoost:        5,
	dpscalc.OverloadPlus:       6,
	dpscalc.RangingBoost:       7,
	dpscalc.SaturatedHeart:     8,
	dpscalc.SmellingSalts:      9,
	dpscalc.StrengthBoost:      10,
	dpscalc.SuperAttackBoost:   11,
	dpscalc.SuperStrengthBoost: 12,
	dpscalc.DivineRangingBoost: 13,
	dpscalc.SuperCombatBoost:   14,
	dpscalc.DivineMagicBoost:   15,
}
