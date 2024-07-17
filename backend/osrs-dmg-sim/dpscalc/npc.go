package dpscalc

import (
	"slices"

	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/wikidata"
)

const (
	iceDemon = 7584
)

var dukeSucellus = []string{"12166", "12166_1", "12193"}
var zulrahs = []int{2043, 2042, 2044}
var corporealBeast = 319

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

	elementalWeaknessType    elementalType
	elementalWeaknessPercent int

	size int

	isKalphite      bool
	isDemon         bool
	isDragon        bool
	isUndead        bool
	isVampyre1      bool
	isVampyre2      bool
	isVampyre3      bool
	isLeafy         bool
	IsXerician      bool
	isShade         bool
	isTobEntryMode  bool
	isTobNormalMode bool
	isTobHardMode   bool

	respawn int
}

type npcs map[string]npc

func getNpcs(npcsData map[string]wikidata.NpcData) npcs {
	npcs := make(npcs)

	for id, npcData := range npcsData {
		n := npc{}
		n.name = npcData.Name
		n.respawn = npcData.Respawn
		n.size = npcData.Size
		n.isKalphite = npcData.IsKalphite
		n.isDemon = npcData.IsDemon
		n.isDragon = npcData.IsDragon
		n.isUndead = npcData.IsUndead
		n.isLeafy = npcData.IsLeafy
		n.IsXerician = npcData.IsXerician
		n.isShade = npcData.IsShade
		n.isTobEntryMode = npcData.IsTobEntryMode
		n.isTobNormalMode = npcData.IsTobNormalMode
		n.isTobHardMode = npcData.IsTobHardMode

		n.elementalWeaknessPercent = npcData.ElementalWeaknessPercent
		n.elementalWeaknessType = elementalType(npcData.ElementalWeaknessType)

		n.combatStats = CombatStats{
			Attack:    npcData.Attack,
			Strength:  npcData.Strength,
			Ranged:    npcData.Ranged,
			Magic:     npcData.Magic,
			Hitpoints: npcData.Hitpoints,
			Defence:   npcData.Defence,
		}

		n.BaseCombatStats = n.combatStats

		n.aggressiveStats = aggressiveStats{
			attack: npcData.AAttack,
			magic:  npcData.AMagic,
			ranged: npcData.ARange,
		}

		n.damageStats = damageStats{
			meleeStrength:  npcData.MeleeStrength,
			rangedStrength: npcData.RangedStrength,
			magicStrength:  npcData.MagicStrength,
		}

		n.defensiveStats = defensiveStats{
			stab:     npcData.DStab,
			slash:    npcData.DSlash,
			crush:    npcData.DSCrush,
			magic:    npcData.DMagic,
			ranged:   npcData.DRange,
			light:    npcData.DLight,
			standard: npcData.DStandard,
			heavy:    npcData.DHeavy,
		}

		npcs[id] = n
	}

	return npcs
}

func (npc *npc) applyAllNpcScaling(globalSettings *GlobalSettings, inputGearSetup *InputGearSetup) {
	npc.ApplyNpcScaling(globalSettings)
	npc.applyStatDrain(globalSettings, inputGearSetup.GearSetupSettings.StatDrain)

	if globalSettings.NpcHitpoints != 0 {
		npc.combatStats.Hitpoints = globalSettings.NpcHitpoints
	}
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
