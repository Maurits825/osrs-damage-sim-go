package damagesim

func getPotionBoostStats(baseStats CombatStats, potionBoosts []PotionBoost) CombatStats {
	combatBoost := CombatStats{}
	for _, potionBoost := range potionBoosts {
		combatBoost.boostStats(baseStats, potionBoost)
	}
	return combatBoost
}

func (stats *CombatStats) boostStats(base CombatStats, potionBoost PotionBoost) {
	switch potionBoost {
	case SuperCombat:
		stats.Attack = boost(base.Attack, 5, 0.15)
		stats.Strength = boost(base.Strength, 5, 0.15)
	}
}

func boost(stat int, base int, percent float32) int {
	return base + int(float32(stat)*percent)
}
