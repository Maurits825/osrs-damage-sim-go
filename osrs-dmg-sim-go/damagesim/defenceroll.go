package damagesim

import "github.com/Maurits825/osrs-damage-sim/osrs-dmg-sim-go/damagesim/dpsdetail"

func getNpcDefenceRoll(player *player) int {
	//TODO test if use magic def here
	level := dpsDetailEntries.TrackValue(dpsdetail.NPCDefenceRollBase, player.npc.combatStats.Defence)
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

	return dpsDetailEntries.TrackValue(dpsdetail.NPCDefenceRollFinal, defenceRoll)
}
