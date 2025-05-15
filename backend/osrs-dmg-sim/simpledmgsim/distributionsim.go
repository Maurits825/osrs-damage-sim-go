package simpledmgsim

import (
	"fmt"
	"math/rand/v2"

	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/dpscalc"
)

type simGearSetup struct {
	setupPlayer *dpscalc.Player
	hitDist     []float32
	attackSpeed int
}

// TODO for one setup?
func runDistSim(presets []dpscalc.GearSetup, gs *dpscalc.GlobalSettings, setup InputGearSetup) *SimResult {
	//setup stuff
	//TODO if def reductions, what needs to be recalced -> just getHitDist
	simGearSetups := getSimGearSetups(presets, gs, setup)

	npcHp := simGearSetups[0].setupPlayer.Npc.CombatStats.Hitpoints //TODO indexing here is scuffed?
	var currentGear *simGearSetup

	//todo main loop
	//based on tick per tick? we need to keep track of spec also
	ticksToKill := 0
	for npcHp > 0 {
		//first use conditions to get the right hitdist
		currentGear = &simGearSetups[0]

		damage := rollHitDist(currentGear.hitDist)
		fmt.Println("damage rolled:", damage)
		npcHp -= damage

		ticksToKill += currentGear.attackSpeed
	}

	return &SimResult{ticksToKill: ticksToKill}
}

func getSimGearSetups(presets []dpscalc.GearSetup, gs *dpscalc.GlobalSettings, setup InputGearSetup) []simGearSetup {
	players := make([]simGearSetup, len(setup.GearSimSetups)+1)

	mainCalcSetup := &dpscalc.InputGearSetup{
		GearSetupSettings: setup.GearSetupSettings,
		GearSetup:         presets[setup.MainGearSimSetup.GearPresetIndex],
	}

	p := dpscalc.GetPlayer(gs, mainCalcSetup)
	players[0] = simGearSetup{
		setupPlayer: p,
		hitDist:     dpscalc.GetPlayerHitDist(p),
		attackSpeed: dpscalc.GetAttackSpeed(p),
	}

	for i, gearSimSetup := range setup.GearSimSetups {
		dpsCalcSetup := &dpscalc.InputGearSetup{
			GearSetupSettings: setup.GearSetupSettings,
			GearSetup:         presets[gearSimSetup.GearPresetIndex],
		}
		p = dpscalc.GetPlayer(gs, dpsCalcSetup)
		players[i+1] = simGearSetup{
			setupPlayer: p,
			hitDist:     dpscalc.GetPlayerHitDist(p),
			attackSpeed: dpscalc.GetAttackSpeed(p),
		}
	}
	return players
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

	panic("rollHitDist: no hit rolled")
}
