package dpscalc

import "slices"

var dukeSucellus = []string{"12166", "12166_1", "12193"}

type aggressiveStats struct {
	attack int
	magic  int
	ranged int
}

type npc struct {
	id              int
	name            string
	BaseCombatStats CombatStats
	combatStats     CombatStats
	aggressiveStats aggressiveStats
	damageStats     damageStats
	defensiveStats  defensiveStats

	size int

	isKalphite      bool
	isDemon         bool
	isDragon        bool
	isUndead        bool
	isVampyre1      bool
	isVampyre2      bool
	isVampyre3      bool
	isLeafy         bool
	isXerician      bool
	isShade         bool
	isTobEntryMode  bool
	isTobNormalMode bool
	isTobHardMode   bool

	respawn int
}

func (npc *npc) applyAllNpcScaling(globalSettings *GlobalSettings, inputGearSetup *InputGearSetup) {
	npc.ApplyNpcScaling(globalSettings)
	npc.applyStatDrain(globalSettings, inputGearSetup.GearSetupSettings.StatDrain)
}

func (npc *npc) ApplyNpcScaling(globalSettings *GlobalSettings) {
	npc.applyCoxScaling(globalSettings)
	npc.applyTobScaling(globalSettings)
	npc.applyToaScaling(globalSettings)

	npc.combatStats = npc.BaseCombatStats
}

func getDemonbaneFactor(npcId string, numerator int, denominator int) (int, int) {
	if slices.Contains(dukeSucellus, npcId) {
		numerator *= 7
		denominator *= 10
	}

	numerator += denominator
	return numerator, denominator
}
