package dpscalc

import (
	"slices"

	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/dpscalc/dpsdetail"
	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/wikidata"
)

const (
	iceDemon       = 7584
	corporealBeast = 319
)

var dukeSucellus = []string{"12166", "12166_1", "12193"}
var zulrahs = []int{2043, 2042, 2044}
var araxxor = []int{13668}
var yama = "14176"

type aggressiveStats struct {
	attack int
	magic  int
	ranged int
}

type npc struct {
	id              int
	name            string
	BaseCombatStats CombatStats
	CombatStats     CombatStats
	aggressiveStats aggressiveStats
	damageStats     damageStats
	defensiveStats  defensiveStats

	elementalWeaknessType    elementalType
	elementalWeaknessPercent int

	size int

	isKalphite      bool
	isDemon         bool
	IsDragon        bool
	IsUndead        bool
	isVampyre1      bool
	isVampyre2      bool
	isVampyre3      bool
	isLeafy         bool
	IsXerician      bool
	isShade         bool
	isTobEntryMode  bool
	isTobNormalMode bool
	isTobHardMode   bool

	demonbaneVulnerability float32

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
		n.IsDragon = npcData.IsDragon
		n.IsUndead = npcData.IsUndead
		n.isLeafy = npcData.IsLeafy
		n.IsXerician = npcData.IsXerician
		n.isShade = npcData.IsShade
		n.isTobEntryMode = npcData.IsTobEntryMode
		n.isTobNormalMode = npcData.IsTobNormalMode
		n.isTobHardMode = npcData.IsTobHardMode

		n.elementalWeaknessPercent = npcData.ElementalWeaknessPercent
		n.elementalWeaknessType = elementalType(npcData.ElementalWeaknessType)

		n.demonbaneVulnerability = 0
		if npcData.IsDemon {
			n.demonbaneVulnerability = getDemonbaneVulnerability(id)
		}

		n.CombatStats = CombatStats{
			Attack:    npcData.Attack,
			Strength:  npcData.Strength,
			Ranged:    npcData.Ranged,
			Magic:     npcData.Magic,
			Hitpoints: npcData.Hitpoints,
			Defence:   npcData.Defence,
		}

		n.BaseCombatStats = n.CombatStats

		n.aggressiveStats = aggressiveStats{
			attack: npcData.AAttack,
			magic:  npcData.AMagic,
			ranged: npcData.ARange,
		}

		n.damageStats = damageStats{
			meleeStrength:  npcData.MeleeStrength,
			rangedStrength: npcData.RangedStrength,
			magicStrength:  float32(npcData.MagicStrength),
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
	npc.ApplyStatDrain(globalSettings, inputGearSetup.GearSetupSettings.StatDrain)

	if globalSettings.NpcHitpoints != 0 {
		npc.CombatStats.Hitpoints = globalSettings.NpcHitpoints
	}
}

func (npc *npc) ApplyNpcScaling(globalSettings *GlobalSettings) {
	npc.applyCoxScaling(globalSettings)
	npc.applyTobScaling(globalSettings)
	npc.applyToaScaling(globalSettings)

	npc.CombatStats = npc.BaseCombatStats
}

func getDemonbaneFactor(vuln float32, weaponDemonbane int) factor {
	percent := dpsDetailEntries.TrackFactor(dpsdetail.PlayerDemonbaneFactor, weaponDemonbane, int(vuln), 100)
	return factor{percent, 100}
}

func getDemonbaneVulnerability(npcId string) float32 {
	if slices.Contains(dukeSucellus, npcId) {
		return 70
	} else if npcId == yama {
		return 120
	}

	return 100
}
