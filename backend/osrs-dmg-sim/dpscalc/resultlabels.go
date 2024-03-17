package dpscalc

import "strconv"

const (
	MaxLevel = 99
)

func getGearSetupSettingsLabel(settings *GearSetupSettings) string {
	labels := []string{
		getCombatStatsLabel(&settings.CombatStats),
		getPotionBoostLabel(settings.PotionBoosts),
		getStatDrainLabel(settings.StatDrain),
	}

	finalLabel := ""
	for _, label := range labels {
		if label != "" {
			finalLabel += label + " | "
		}
	}

	return finalLabel[:len(finalLabel)-2]
}

func getCombatStatsLabel(combatStats *CombatStats) string {
	label := ""
	switch {
	case combatStats.Hitpoints != MaxLevel:
		label += "Hp: " + strconv.Itoa(combatStats.Hitpoints) + ", "
	case combatStats.Attack != MaxLevel:
		label += "Att: " + strconv.Itoa(combatStats.Attack) + ", "
	case combatStats.Strength != MaxLevel:
		label += "Str: " + strconv.Itoa(combatStats.Strength) + ", "
	case combatStats.Defence != MaxLevel:
		label += "Def: " + strconv.Itoa(combatStats.Defence) + ", "
	case combatStats.Magic != MaxLevel:
		label += "Magic: " + strconv.Itoa(combatStats.Magic) + ", "
	case combatStats.Ranged != MaxLevel:
		label += "Ranged: " + strconv.Itoa(combatStats.Ranged) + ", "
	}
	if label != "" {
		return "Combat stats: " + label[:len(label)-2]
	}
	return ""
}

func getPotionBoostLabel(potionBoosts []PotionBoost) string {
	label := ""
	for _, potionBoost := range potionBoosts {
		switch potionBoost {
		case SuperCombat:
			label += "SCP, "
		}
	}
	if label != "" {
		return "Potions: " + label[:len(label)-2]
	}
	return ""
}

func getStatDrainLabel(statDrains []StatDrain) string {
	label := ""
	for _, statDrain := range statDrains {
		var statDrainType string
		switch statDrain.Name {
		case DragonWarhammer, Arclight:
			if statDrain.Value == 1 {
				statDrainType = "hit"
			} else {
				statDrainType = "hits"
			}
		case BandosGodsword:
			statDrainType = "damage"
		}

		var statDrainName string
		switch statDrain.Name {
		case DragonWarhammer:
			statDrainName = "DHW"
		case Arclight:
			statDrainName = "Arclight"
		case BandosGodsword:
			statDrainName = "BGS"
		}

		label += statDrainName + ": " + strconv.Itoa(statDrain.Value) + " " + statDrainType + ", "
	}
	if label != "" {
		return "Stat drain - " + label[:len(label)-2]
	}
	return ""
}

func getAttackCycleLabel(attackCycle int) string {
	if attackCycle == 0 {
		return ""
	}
	return strconv.Itoa(attackCycle) + "t cycle"
}
