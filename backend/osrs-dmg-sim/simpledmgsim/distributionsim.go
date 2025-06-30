package simpledmgsim

import (
	"math/rand/v2"

	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/dpscalc"
)

const specialAttackRegen = 2
const maxSpecialAttack = 1000

// TODO name of this????
type simGearSetup struct {
	gearPresetIndex   int
	conditions        []Condition
	attackSpeed       int
	specialAttackCost int

	damageDealt int
	attackCount int
}

type simPlayer struct {
	attackTick    int
	specialAttack int
}

// TODO for one setup?
func runDistSim(presets []dpscalc.GearSetup, gs *dpscalc.GlobalSettings, setup InputGearSetup) *SimResult {
	//setup stuff
	//TODO if def reductions, what needs to be recalced -> just getHitDist
	simGearSetups := getSimGearSetups(presets, gs, setup)
	simPlayer := simPlayer{0, maxSpecialAttack}
	npc := dpscalc.GetNpc(gs.Npc.Id)

	input := &dpscalc.InputGearSetup{GearSetupSettings: setup.GearSetupSettings}
	npc.ApplyAllNpcScaling(gs, input)

	iterations := 1_000_000

	hdc := newHitDistCache(gs, &setup.GearSetupSettings, presets)

	//TODO func here for now, split in other fns in the future?
	runOneIter := func() int {
		//reset stuff
		simPlayer.attackTick = 0
		simPlayer.specialAttack = maxSpecialAttack

		for i := range simGearSetups {
			simGearSetups[i].damageDealt = 0
			simGearSetups[i].attackCount = 0
		}

		npcHp := npc.CombatStats.Hitpoints
		var currentGear *simGearSetup

		ticksToKill := 0
		for {
			if npcHp < 0 {
				break
			}

			simPlayer.attackTick -= 1

			if simPlayer.attackTick <= 0 {
				currentGear = getNextSimGear(simGearSetups, npcHp, simPlayer)
				dist := hdc.getHitDist(npc, currentGear.gearPresetIndex)
				damage := rollHitDist(dist)

				//TODO if stat drain do something here

				npcHp -= damage
				simPlayer.attackTick = currentGear.attackSpeed
				simPlayer.specialAttack -= currentGear.specialAttackCost
			}

			//TODO lb
			simPlayer.specialAttack = min(simPlayer.specialAttack+specialAttackRegen, maxSpecialAttack)
			ticksToKill += 1
		}
		return ticksToKill
	}

	ticksSum := 0
	for range iterations {
		ticks := runOneIter()
		ticksSum += ticks
	}

	averageTicks := ticksSum / iterations
	return &SimResult{ticksToKill: averageTicks}

}

func getSimGearSetups(presets []dpscalc.GearSetup, gs *dpscalc.GlobalSettings, setup InputGearSetup) []simGearSetup {
	setups := make([]simGearSetup, len(setup.GearSimSetups)+1)

	allGearSetups := append([]GearSimSetup{setup.MainGearSimSetup}, setup.GearSimSetups...)
	for i, gearSimSetup := range allGearSetups {
		dpsCalcSetup := &dpscalc.InputGearSetup{
			GearSetupSettings: setup.GearSetupSettings,
			GearSetup:         presets[gearSimSetup.GearPresetIndex],
		}
		p := dpscalc.GetPlayer(gs, dpsCalcSetup)
		setups[i] = simGearSetup{
			gearPresetIndex:   gearSimSetup.GearPresetIndex,
			conditions:        gearSimSetup.Conditions,
			attackSpeed:       dpscalc.GetAttackSpeed(p),
			specialAttackCost: p.SpecialAttackCost * 10, //TODO adren pot
		}
	}
	return setups
}

func getNextSimGear(simGearSetups []simGearSetup, npcHp int, player simPlayer) *simGearSetup {
	for i := range simGearSetups[1:] {
		s := &simGearSetups[i+1]
		useSetup := evaluateConditions(s.conditions, npcHp, s.damageDealt, s.attackCount)
		if useSetup {
			if s.specialAttackCost <= player.specialAttack {
				return s
			} else {
				return &simGearSetups[0]
			}
		}
	}
	return &simGearSetups[0]
}

func rollHitDist(dist []float32) int {
	r := rand.Float32()

	cumulativeProb := float32(0.0)
	for i, prob := range dist {
		cumulativeProb += prob
		if r <= cumulativeProb {
			return i
		}
	}

	return len(dist)
}
