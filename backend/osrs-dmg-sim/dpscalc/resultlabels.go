package dpscalc

import "strconv"

const (
	MaxLevel = 99
)

var prayerLabel = map[Prayer]string{
	Piety: "Piety",
}

var potionLabel = map[PotionBoost]string{
	SuperCombatBoost: "SCP",
}

func getGearSetupLabel(gearSetup *GearSetup) string {
	label := ""
	for _, prayer := range gearSetup.Prayers {
		label += prayerLabel[prayer] + ", "
	}

	if label != "" {
		return gearSetup.Name + " (" + label[:len(label)-2] + ")"
	}
	return gearSetup.Name
}
func getGearSetupSettingsLabel(settings *GearSetupSettings) string {
	labels := []string{
		getCombatStatsLabel(&settings.CombatStats),
		getPotionBoostLabel(settings.PotionBoosts),
		getStatDrainLabel(settings.StatDrain),
		getAttackCycleLabel(settings.AttackCycle),
	}

	finalLabel := ""
	for _, label := range labels {
		if label != "" {
			finalLabel += label + " | "
		}
	}

	if finalLabel != "" {
		return finalLabel[:len(finalLabel)-2]
	}
	return ""
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
		label += potionLabel[potionBoost] + ", "
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