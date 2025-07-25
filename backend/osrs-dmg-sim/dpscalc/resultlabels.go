package dpscalc

import (
	"slices"
	"strconv"
	"strings"
)

const (
	MaxLevel = 99
)

var prayerLabels = map[Prayer]string{
	PietyPrayer:  "Piety",
	RigourPrayer: "Rigour",
	AuguryPrayer: "Augury",
}

var potionLabels = map[PotionBoost]string{
	OverloadPlus:     "Overload+",
	SmellingSalts:    "Salts",
	SuperCombatBoost: "SCP",
	RangingBoost:     "Ranging",
	SaturatedHeart:   "Saturated heart",
}

var statDrainLabels = map[StatDrainWeapon]string{
	DragonWarhammer:   "DHW",
	Arclight:          "Arclight",
	Emberlight:        "Emberlight",
	BandosGodsword:    "BGS",
	AccursedSceptre:   "Accursed Sceptre",
	BoneDagger:        "Bone Dagger",
	BarrelChestAnchor: "Anchor",
}

func GetDpsCalcTitle(globalSettings *GlobalSettings) string {
	npc := GetNpc(globalSettings.Npc.Id)
	npc.ApplyNpcScaling(globalSettings)

	title := getNpcTitle(globalSettings, &npc) +
		" | HP: " + strconv.Itoa(npc.BaseCombatStats.Hitpoints) +
		" | Def: " + strconv.Itoa(npc.CombatStats.Defence)

	if slices.Contains(ToaIds, npc.id) {
		title += " | Raid level: " + strconv.Itoa(globalSettings.RaidLevel)
		if slices.Contains(toaPathIds, npc.id) {
			title += " | Path level: " + strconv.Itoa(globalSettings.PathLevel)
		}
	}

	return title
}

func getNpcTitle(globalSettings *GlobalSettings, npc *Npc) string {
	npcTitle := npc.name

	if globalSettings.CoxScaling.IsChallengeMode {
		npcTitle += " (CM)"
	}
	if npc.isTobHardMode {
		npcTitle += " (HM)"
	}
	if npc.isTobEntryMode {
		npcTitle += " (EM)"
	}

	return npcTitle
}

func getGearSetupLabel(gearSetup *GearSetup) string {
	label := ""
	for _, prayer := range gearSetup.Prayers {
		label += prayerLabels[prayer] + ", "
	}

	if gearSetup.IsSpecialAttack {
		label += "Special, "
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

	var builder strings.Builder
	for _, label := range labels {
		if label != "" {
			builder.WriteString(label)
			builder.WriteString(" | ")
		}
	}

	if builder.Len() > 0 {
		label := builder.String()
		return label[:len(label)-2]
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
	var builder strings.Builder

	for _, potionBoost := range potionBoosts {
		builder.WriteString(potionLabels[potionBoost])
		builder.WriteString(", ")
	}

	if builder.Len() > 0 {
		label := builder.String()
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

		label += statDrainLabels[statDrain.Name] + ": " + strconv.Itoa(statDrain.Value) + " " + statDrainType + ", "
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
