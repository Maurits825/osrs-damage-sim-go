package damagesim

func (stats *CombatStats) boostStats(potionBoost PotionBoost) {
	switch potionBoost {
	case SuperCombat:
		stats.Attack = boost(stats.Attack, 5, 0.15)
		stats.Strength = boost(stats.Strength, 5, 0.15)
	}
}

func boost(stat int, base int, percent float32) int {
	return base + int(float32(stat)*percent)
}
