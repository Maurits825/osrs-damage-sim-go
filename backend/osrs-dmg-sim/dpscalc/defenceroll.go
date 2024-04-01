package dpscalc

import (
	"slices"

	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/dpscalc/dpsdetail"
)

// TODO add verzik
var useDefLevelForMagicDefNpcs = slices.Concat(
	[]int{
		7584,         // ice demon reg
		7585,         // ice demon cm
		11709, 11712, // baboon brawler
		9118, // rabbit (prifddinas)
	}, verzikIds)

// TODO wiki doesnt mention ancient gs rolling against slash
var slashOverrideSpecWeapons = []int{
	armadylGodsword, bandosGodsword, saradominGodsword, zamorakGodsword,
	abbysalDagger, dragonDagger, crystalHalberd,
	ursineMace,
}

func getNpcDefenceRoll(player *player) int {
	npcId := player.npc.id

	level := player.npc.combatStats.Defence
	if player.combatStyle.combatStyleType == Magic && !slices.Contains(useDefLevelForMagicDefNpcs, npcId) {
		level = player.npc.combatStats.Magic
	}

	dpsDetailEntries.TrackValue(dpsdetail.NPCDefenceRollBase, level)
	effectiveLevel := dpsDetailEntries.TrackAdd(dpsdetail.NPCDefenceRollEffectiveLevel, level, 9)

	defence := 0
	switch player.combatStyle.combatStyleType {
	case Stab:
		defence = player.npc.defensiveStats.stab
	case Slash:
		defence = player.npc.defensiveStats.slash
	case Crush:
		defence = player.npc.defensiveStats.crush
	case Magic:
		defence = player.npc.defensiveStats.magic
	case Ranged:
		defence = player.npc.defensiveStats.ranged
	}

	if player.equippedGear.isAnyEquipped(slashOverrideSpecWeapons) && player.inputGearSetup.GearSetup.IsSpecialAttack {
		defence = player.npc.defensiveStats.slash
	}

	statBonus := dpsDetailEntries.TrackAdd(dpsdetail.NPCDefenceStatBonus, defence, 64)
	defenceRoll := dpsDetailEntries.TrackFactor(dpsdetail.NPCAccuracyRollBase, effectiveLevel, statBonus, 1)

	if slices.Contains(ToaIds, npcId) {
		defenceRoll = int(defenceRoll * (250 + player.globalSettings.RaidLevel) / 250)
		dpsDetailEntries.TrackValue(dpsdetail.NPCDefenceRollTOA, defenceRoll)
	}

	dpsDetailEntries.TrackValue(dpsdetail.NPCDefenceRollFinal, defenceRoll)
	return defenceRoll
}
