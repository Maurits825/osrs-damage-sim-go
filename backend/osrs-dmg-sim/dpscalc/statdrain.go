package dpscalc

import "slices"

func getMinDefence(npc *npc) int {
	if npc.name == "Verzik Vitur" || npc.name == "Vardorvis" {
		return npc.combatStats.Defence
	}
	if npc.name == "Sotetseg" {
		return 100
	}
	if npc.name == "The Nightmare" || npc.name == "Phosani\"s Nightmare" {
		return 120
	}
	if npc.name == "Akkha" {
		return 70
	}
	if npc.name == "Ba-Ba" {
		return 60
	}
	if npc.name == "Kephri" {
		return 60
	}
	if npc.name == "Zebak" {
		return 50
	}
	if slices.Contains(p3WardenIds, npc.id) {
		return 120
	}
	if npc.name == "Obelisk" {
		return 60
	}
	if npc.name == "Nex" {
		return 250
	}

	// no limit
	return 0
}

func (npc *npc) applyStatDrain(globalSettings *GlobalSettings, statsDrains []StatDrain) {
	minDefence := getMinDefence(npc)
	//StatsDrains set the combatStats on the npc
	for _, statDrain := range statsDrains {
		switch statDrain.Name {
		case DragonWarhammer:
			for range statDrain.Value {
				currentDefence := npc.combatStats.Defence
				defence := currentDefence - int(currentDefence*3/10)
				npc.combatStats.Defence = max(minDefence, defence)
			}
		case ElderMaul:
			for range statDrain.Value {
				currentDefence := npc.combatStats.Defence
				defence := currentDefence - int(currentDefence*35/100) //TODO math
				npc.combatStats.Defence = max(minDefence, defence)
			}
		case Arclight, Emberlight:
			numerator := 1
			if npc.isDemon {
				numerator = 2
				if statDrain.Name == Emberlight {
					numerator = 3
				}
			}
			scaleStat := func(base int, current int) int {
				return current - (statDrain.Value * (int(base*numerator/20) + 1))
			}
			npc.combatStats.Attack = scaleStat(npc.BaseCombatStats.Attack, npc.combatStats.Attack)
			npc.combatStats.Strength = scaleStat(npc.BaseCombatStats.Strength, npc.combatStats.Strength)
			npc.combatStats.Defence = max(minDefence, scaleStat(npc.BaseCombatStats.Defence, npc.combatStats.Defence))
		case BandosGodsword:
			npc.combatStats.Defence = max(minDefence, npc.combatStats.Defence-statDrain.Value)
		case AccursedSceptre:
			if statDrain.Value >= 1 {
				npc.combatStats.Defence = max(minDefence, int(npc.BaseCombatStats.Defence*17/20))
				npc.combatStats.Magic = int(npc.BaseCombatStats.Magic * 17 / 20)
			}
		case BoneDagger:
			npc.combatStats.Defence = max(minDefence, npc.combatStats.Defence-statDrain.Value)
		case BarrelChestAnchor:
			npc.combatStats.Defence = max(minDefence, npc.combatStats.Defence-int(float32(statDrain.Value)*0.1))
		case Ralos:
			for range statDrain.Value {
				currentDefence := npc.combatStats.Defence
				defence := currentDefence - int(npc.combatStats.Magic/10)
				npc.combatStats.Defence = max(minDefence, defence)
			}
		}
	}
}
