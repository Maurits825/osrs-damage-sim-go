package simpledmgsim

import (
	"math"
	"math/rand/v2"
	"slices"

	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/dpscalc"
)

const baseSpecialAttackRegen = 100
const specialAttackRegenTick = 50
const maxSpecialAttack = 1000

type statDrainer func(*dpscalc.Npc, int)

// TODO name of this????
type simGearSetup struct {
	gearPresetIndex   int
	conditions        []Condition
	attackSpeed       int
	specialAttackCost int

	damageDealt int
	attackCount int

	statDrainer statDrainer
}

type simPlayer struct {
	attackTick             int
	specialAttack          int
	specialAttackRegenTick int
}

type distSimRunner struct {
	iterations        int
	detailedRunLogger *detailedRunLogger
	rng               *rand.Rand
}

func newDistSimRunner(iterations int, rng *rand.Rand) *distSimRunner {
	if rng == nil {
		rng = rand.New(rand.NewPCG(rand.Uint64(), rand.Uint64()))
	}

	return &distSimRunner{
		iterations:        iterations,
		detailedRunLogger: nil,
		rng:               rng,
	}
}

func RunAllDistSim(inputSetup *InputSetup) SimpleDmgSimResults {
	simResults := make([]*simResult, len(inputSetup.InputGearSetups))

	runner := newDistSimRunner(inputSetup.SimSettings.Iterations, nil)
	for i := range inputSetup.InputGearSetups {
		//todo is better way to handle? -> have like a nopLogger
		//todo also is the perf affected? -> check benchmarks
		if inputSetup.SimSettings.IsDetailedRun {
			runner.detailedRunLogger = newDetailedRunLogger()
		}
		results := runner.runDistSim(inputSetup, i)
		simResults[i] = results
	}

	return SimpleDmgSimResults{
		Results: simResults,
	}
}

// todo better/cleaner way to manage input args
func (runner *distSimRunner) runDistSim(inputSetup *InputSetup, index int) *simResult {
	presets := inputSetup.GearPresets
	gs := &inputSetup.GlobalSettings
	setup := inputSetup.InputGearSetups[index]

	simGearSetups := getSimGearSetups(presets, gs, setup)
	simPlayer := simPlayer{0, maxSpecialAttack, 0}
	npc := dpscalc.GetNpc(gs.Npc.Id)

	input := &dpscalc.InputGearSetup{GearSetupSettings: setup.GearSetupSettings}
	npc.ApplyAllNpcScaling(gs, input)

	hdc := newHitDistCache(gs, &setup.GearSetupSettings, presets)

	//TODO func here for now, split in other fns in the future?
	runOneIter := func() int {
		//reset stuff
		simPlayer.attackTick = 0
		simPlayer.specialAttack = maxSpecialAttack
		simPlayer.specialAttackRegenTick = 0

		for i := range simGearSetups {
			simGearSetups[i].damageDealt = 0
			simGearSetups[i].attackCount = 0
		}

		npc.CombatStats = npc.BaseCombatStats
		var currentGear *simGearSetup

		ticksToKill := 0
		for {
			if npc.CombatStats.Hitpoints < 0 {
				break
			}

			simPlayer.attackTick -= 1
			simPlayer.specialAttackRegenTick += 1

			//regen spec before attacking, i think its possible to spec on the same tick as the regen happens?
			//TODO lb
			if simPlayer.specialAttackRegenTick > specialAttackRegenTick {
				simPlayer.specialAttackRegenTick = 1
				simPlayer.specialAttack = min(simPlayer.specialAttack+baseSpecialAttackRegen, maxSpecialAttack)
			}

			if simPlayer.attackTick <= 0 {
				currentGear = getNextSimGear(simGearSetups, npc.CombatStats.Hitpoints, simPlayer)
				dist := hdc.getHitDist(npc, currentGear.gearPresetIndex)

				damage := runner.rollHitDist(dist)

				if runner.detailedRunLogger != nil {
					runner.detailedRunLogger.logData(
						ticksToKill, damage, currentGear, dist, &npc, simPlayer,
					)
				}

				if currentGear.statDrainer != nil {
					currentGear.statDrainer(&npc, damage)
				}

				npc.CombatStats.Hitpoints -= damage
				currentGear.damageDealt += damage
				currentGear.attackCount += 1 //TODO attack count is just that, not accurate hits? should it be?

				simPlayer.attackTick = currentGear.attackSpeed
				simPlayer.specialAttack -= currentGear.specialAttackCost
			}

			ticksToKill += 1
		}
		return ticksToKill
	}

	ttkMap := make(map[int]int)
	maxTtk := 0
	minTtk := math.MaxInt
	for range runner.iterations {
		ttk := runOneIter()
		if ttk > maxTtk {
			maxTtk = ttk
		}
		if ttk < minTtk {
			minTtk = ttk
		}
		ttkMap[ttk] += 1

		if runner.detailedRunLogger != nil {
			runner.detailedRunLogger.logKill(ttk)
		}
	}

	results := getSimResults(ttkMap, maxTtk+1, minTtk, runner)
	return results
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

		specCost := p.SpecialAttackCost * 10
		if specCost != 0 && gs.OverlyDraining {
			specCost = maxSpecialAttack
		}
		if slices.Contains(setup.GearSetupSettings.PotionBoosts, dpscalc.LiquidAdrenaline) {
			specCost /= 2
		}

		setups[i] = simGearSetup{
			gearPresetIndex:   gearSimSetup.GearPresetIndex,
			conditions:        gearSimSetup.Conditions,
			attackSpeed:       dpscalc.GetAttackSpeed(p),
			specialAttackCost: specCost,
			statDrainer:       getStatDrainer(p),
		}
	}
	return setups
}

var statDrainIds = map[int]dpscalc.StatDrainWeapon{
	13576: dpscalc.DragonWarhammer,
	21003: dpscalc.ElderMaul,
	19675: dpscalc.Arclight,
	29589: dpscalc.Emberlight,
	11804: dpscalc.BandosGodsword,
	27662: dpscalc.AccursedSceptre,
	8872:  dpscalc.BoneDagger,
	10887: dpscalc.BarrelChestAnchor,
	28919: dpscalc.Ralos,
}

func getStatDrainer(player *dpscalc.Player) statDrainer {
	var statDrainWeapon dpscalc.StatDrainWeapon
	for itemId, d := range statDrainIds {
		if player.IsEquipped(itemId) {
			statDrainWeapon = d
			break
		}
	}

	if statDrainWeapon == "" {
		return nil
	}

	statDrain := make([]dpscalc.StatDrain, 1)
	statDrain[0] = dpscalc.StatDrain{
		Name:  statDrainWeapon,
		Value: 0,
	}

	return func(npc *dpscalc.Npc, damage int) {
		statDrain[0].Value = damage
		npc.ApplyStatDrain(statDrain)
	}
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

// TODO check if some binary search stuff is faster
func (r *distSimRunner) rollHitDist(dist []float32) int {
	random := r.rng.Float32()

	start := len(dist) / 2
	if random <= dist[start] {
		start = 0
	}
	for i, prob := range dist[start:] {
		if random <= prob {
			return i + start
		}
	}

	return len(dist) - 1
}
