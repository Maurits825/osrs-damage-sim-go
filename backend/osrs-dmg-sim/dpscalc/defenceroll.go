package dpscalc

import (
	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/dpscalc/dpsdetail"
)

func getNpcDefenceRoll(player *player) int {
	//TODO test if use magic def here
	level := player.npc.combatStats.Defence
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

	statBonus := dpsDetailEntries.TrackAdd(dpsdetail.NPCDefenceStatBonus, defence, 64)
	defenceRoll := dpsDetailEntries.TrackFactor(dpsdetail.NPCAccuracyRollBase, effectiveLevel, statBonus, 1)

	//TODO toa scaling
	dpsDetailEntries.TrackValue(dpsdetail.NPCDefenceRollFinal, defenceRoll)
	return defenceRoll
}
