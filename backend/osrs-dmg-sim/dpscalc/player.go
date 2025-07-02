package dpscalc

import (
	"regexp"
)

type offensiveStats struct {
	stab   int
	slash  int
	crush  int
	magic  int
	ranged int
	prayer int
}

type defensiveStats struct {
	stab     int
	slash    int
	crush    int
	magic    int
	ranged   int
	light    int
	standard int
	heavy    int
}

type damageStats struct {
	meleeStrength  int
	rangedStrength int
	magicStrength  float32
}

type equipmentItem struct {
	name           string
	weaponStyle    string
	equipmentStats equipmentStats
}

type equipmentStats struct {
	offensiveStats offensiveStats
	defensiveStats defensiveStats
	damageStats    damageStats
	attackSpeed    int
}

func (stats *equipmentStats) addStats(statsAdd *equipmentStats) {
	stats.offensiveStats.stab += statsAdd.offensiveStats.stab
	stats.offensiveStats.slash += statsAdd.offensiveStats.slash
	stats.offensiveStats.crush += statsAdd.offensiveStats.crush
	stats.offensiveStats.magic += statsAdd.offensiveStats.magic
	stats.offensiveStats.ranged += statsAdd.offensiveStats.ranged
	stats.offensiveStats.prayer += statsAdd.offensiveStats.prayer

	stats.defensiveStats.stab += statsAdd.defensiveStats.stab
	stats.defensiveStats.slash += statsAdd.defensiveStats.slash
	stats.defensiveStats.crush += statsAdd.defensiveStats.crush
	stats.defensiveStats.magic += statsAdd.defensiveStats.magic
	stats.defensiveStats.ranged += statsAdd.defensiveStats.ranged

	stats.damageStats.meleeStrength += statsAdd.damageStats.meleeStrength
	stats.damageStats.rangedStrength += statsAdd.damageStats.rangedStrength
	stats.damageStats.magicStrength += statsAdd.damageStats.magicStrength
}

type CombatStyleType string

const (
	Stab   CombatStyleType = "Stab"
	Slash  CombatStyleType = "Slash"
	Crush  CombatStyleType = "Crush"
	Magic  CombatStyleType = "Magic"
	Ranged CombatStyleType = "Ranged"
)

var AllCombatStyleTypes = []CombatStyleType{Stab, Slash, Crush, Magic, Ranged}

func (style CombatStyleType) IsMeleeStyle() bool {
	return style == Stab || style == Slash || style == Crush
}

type combatStyleStance string

const (
	Accurate   combatStyleStance = "Accurate"
	Aggressive combatStyleStance = "Aggressive"
	Autocast   combatStyleStance = "Autocast"
	Controlled combatStyleStance = "Controlled"
	Defensive  combatStyleStance = "Defensive"
	Longrange  combatStyleStance = "Longrange"
	Rapid      combatStyleStance = "Rapid"
)

type combatStyle struct {
	CombatStyleType   CombatStyleType
	CombatStyleStance combatStyleStance
}

var combatStyleRegex = regexp.MustCompile(`([^\s]+) \(([^/]+)/([^)]+)\)`)

func ParseCombatStyle(style string) combatStyle {
	matches := combatStyleRegex.FindStringSubmatch(style)

	if len(matches) != 4 {
		return combatStyle{}
	}

	combatType := CombatStyleType(matches[2])
	combatStance := combatStyleStance(matches[3])

	return combatStyle{
		CombatStyleType:   combatType,
		CombatStyleStance: combatStance,
	}
}

type factor struct {
	numerator   int
	denominator int
}

type prayerBoost struct {
	meleeAttack    factor
	meleeStrength  factor
	rangedAttack   factor
	rangedStrength factor
	magicAttack    factor
	magicStrength  factor
	defence        factor
	defenceMagic   factor
}

// TODO kinda scuffed to have random exported members
// when we need them?
type Player struct {
	globalSettings        *GlobalSettings
	inputGearSetup        *InputGearSetup
	Npc                   Npc
	combatStatBoost       CombatStats
	equipmentStats        equipmentStats
	combatStyle           combatStyle
	equippedGear          equippedGear
	weaponStyle           string
	SpecialAttackCost     int
	spell                 spell
	ragingEchoesMasteries ragingEchoesMasteries
}

type ragingEchoesMasteries struct {
	melee      int
	ranged     int
	mage       int
	maxMastery int
}

func (p *Player) IsEquipped(itemId int) bool {
	return p.equippedGear.isEquipped(itemId)
}
