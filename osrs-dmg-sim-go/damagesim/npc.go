package damagesim

type aggressiveStats struct {
	attack int
	magic  int
	ranged int
}

type npc struct {
	id              int
	name            string
	baseCombatStats CombatStats
	combatStats     CombatStats
	aggressiveStats aggressiveStats
	damageStats     damageStats
	defensiveStats  defensiveStats

	size       int
	minDefense int

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

//TODO npc scaling here
