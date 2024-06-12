package dpscalc

func GetPotionBoostStats(baseStats CombatStats, potionBoosts []PotionBoost) CombatStats {
	combatBoost := CombatStats{}
	for _, potionBoost := range potionBoosts {
		combatBoost.boostStats(baseStats, potionBoost)
	}
	return combatBoost
}

func (stats *CombatStats) boostStats(base CombatStats, potionBoost PotionBoost) {
	switch potionBoost {
	case SuperCombatBoost:
		stats.Attack = boost(base.Attack, 5, 0.15)
		stats.Strength = boost(base.Strength, 5, 0.15)
		stats.Defence = boost(base.Defence, 5, 0.15)
	case OverloadPlus:
		stats.Attack = boost(base.Attack, 6, 0.16)
		stats.Strength = boost(base.Strength, 6, 0.16)
		stats.Defence = boost(base.Defence, 6, 0.16)
		stats.Ranged = boost(base.Ranged, 6, 0.16)
		stats.Magic = boost(base.Magic, 6, 0.16)
	case AttackBoost:
		stats.Attack = boost(base.Attack, 3, 0.1)
	case SuperAttackBoost:
		stats.Attack = boost(base.Attack, 5, 0.15)
	case DivineSuperAttackBoost:
		stats.Attack = boost(base.Attack, 5, 0.15)
	case StrengthBoost:
		stats.Strength = boost(base.Strength, 3, 0.1)
	case SuperStrengthBoost:
		stats.Strength = boost(base.Strength, 5, 0.15)
	case DivineSuperStrengthBoost:
		stats.Strength = boost(base.Strength, 5, 0.15)
	case CombatBoost:
		stats.Attack = boost(base.Attack, 3, 0.1)
		stats.Strength = boost(base.Strength, 3, 0.1)
	case DivineSuperCombatBoost:
		stats.Attack = boost(base.Attack, 5, 0.15)
		stats.Strength = boost(base.Strength, 5, 0.15)
		stats.Defence = boost(base.Defence, 5, 0.15)
	case ZamorakBrew:
		stats.Attack = boost(base.Attack, 2, 0.2)
		stats.Strength = boost(base.Strength, 2, 0.12)
	case SmellingSalts:
		stats.Attack = boost(base.Attack, 11, 0.16)
		stats.Strength = boost(base.Strength, 11, 0.16)
		stats.Defence = boost(base.Defence, 11, 0.16)
		stats.Ranged = boost(base.Ranged, 11, 0.16)
		stats.Magic = boost(base.Magic, 11, 0.16)
	case MagicBoost:
		stats.Magic = boost(base.Magic, 4, 0)
	case DivineMagicBoost:
		stats.Magic = boost(base.Magic, 4, 0)
	case AncientBrew:
		stats.Magic = boost(base.Magic, 2, 0.05)
	case ForgottenBrew:
		stats.Magic = boost(base.Magic, 3, 0.08)
	case ImbuedHeart:
		stats.Magic = boost(base.Magic, 1, 0.1)
	case SaturatedHeart:
		stats.Magic = boost(base.Magic, 4, 0.1)
	case RangingBoost:
		stats.Ranged = boost(base.Ranged, 4, 0.1)
	case DivineRangingBoost:
		stats.Ranged = boost(base.Ranged, 4, 0.1)
	case LiquidAdrenaline:
		return
	}
}

func boost(stat int, base int, percent float32) int {
	return base + int(float32(stat)*percent)
}
