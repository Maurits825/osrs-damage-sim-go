package dpscalc

func (npc *npc) applyStatDrain(globalSettings *GlobalSettings, statsDrains []StatDrain) {
	minDefence := 0
	//StatsDrains set the combatStats on the npc
	for _, statDrain := range statsDrains {
		switch statDrain.Name {
		case DragonWarhammer:
			for range statDrain.Value {
				currentDefence := npc.combatStats.Defence
				defence := currentDefence - int(currentDefence*3/10)
				npc.combatStats.Defence = max(minDefence, defence)
			}
		case Arclight:
			divisor := 20
			if npc.isDemon {
				divisor = 10
			}
			scaleStat := func(base int, current int) int {
				return current - (statDrain.Value * (int(base/divisor) + 1))
			}
			npc.combatStats.Attack = max(minDefence, scaleStat(npc.baseCombatStats.Attack, npc.combatStats.Attack))
			npc.combatStats.Strength = max(minDefence, scaleStat(npc.baseCombatStats.Strength, npc.combatStats.Strength))
			npc.combatStats.Defence = max(minDefence, scaleStat(npc.baseCombatStats.Defence, npc.combatStats.Defence))
		case BandosGodsword:
			npc.combatStats.Defence = max(minDefence, npc.combatStats.Defence-statDrain.Value)
		}
	}
}
