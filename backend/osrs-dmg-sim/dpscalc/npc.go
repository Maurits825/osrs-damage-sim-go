package dpscalc

type aggressiveStats struct {
	attack int
	magic  int
	ranged int
}

type npc struct {
	name            string
	baseCombatStats CombatStats
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
	npc.applyCoxScaling(globalSettings)
	//TODO other scaling

	npc.combatStats = npc.baseCombatStats
}
