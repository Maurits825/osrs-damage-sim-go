package simpledmgsim

import "github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/dpscalc"

//todo interface for weapon struct or something
type Attackable interface {
	attack() int
}

//todo name
type SimResult struct {
	ticksToKill int
}

func RunSim(presets []dpscalc.GearSetup, gs *dpscalc.GlobalSettings, setup InputGearSetup) *SimResult {
	dpsCalcSetup := &dpscalc.InputGearSetup{
		GearSetupSettings: setup.GearSetupSettings,
		GearSetup:         presets[setup.MainGearSimSetup.GearPresetIndex],
	}

	mainPlayer := dpscalc.GetPlayer(gs, dpsCalcSetup)
	//TODO make player stuff public so we can get this data?
	weapon := weapon{
		maxAttackRoll:  10,
		maxDefenceRoll: 10,
		maxHit:         50,
	}

	npcHp := mainPlayer.Npc.CombatStats.Hitpoints

	attackCount := 0
	for npcHp > 0 {
		damage := weapon.attack()
		npcHp -= damage
		attackCount++
	}

	ticksToKill := attackCount * 4

	//todo could init this once so better mem perf
	return &SimResult{ticksToKill: ticksToKill}
}
