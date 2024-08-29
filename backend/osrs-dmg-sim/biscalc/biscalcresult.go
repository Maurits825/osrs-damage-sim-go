package biscalc

import "github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/dpscalc"

type BisCalcResults struct {
	Title            string          `json:"title"`
	MeleeGearSetups  []BisCalcResult `json:"meleeGearSetups"`
	RangedGearSetups []BisCalcResult `json:"rangedGearSetups"`
	MagicGearSetups  []BisCalcResult `json:"magicGearSetups"`
}

type BisCalcResult struct {
	Gear           map[dpscalc.GearSlot]dpscalc.GearItem `json:"gear"`
	AttackStyle    string                                `json:"attackStyle"`
	Spell          string                                `json:"spell"`
	TheoreticalDps float32                               `json:"theoreticalDps"`
	MaxHit         []int                                 `json:"maxHit"`
	Accuracy       float32                               `json:"accuracy"`
	AttackRoll     int                                   `json:"attackRoll"`
}

func updateBisResult(gear gearSetup, input *dpscalc.InputGearSetup, dpsResult *dpscalc.DpsCalcResult, results []BisCalcResult) {
	newResult := getBisResult(gear, input, dpsResult)
	count := len(results)
	for i := range results {
		if newResult.TheoreticalDps > results[i].TheoreticalDps {
			for j := count - 1; j > i; j-- {
				results[j] = results[j-1]
			}
			results[i] = newResult
			break
		}
	}
}

func getBisResult(gear gearSetup, input *dpscalc.InputGearSetup, result *dpscalc.DpsCalcResult) BisCalcResult {
	return BisCalcResult{
		Gear:           gear.clone(),
		Spell:          input.GearSetup.Spell,
		AttackStyle:    input.GearSetup.AttackStyle,
		TheoreticalDps: result.TheoreticalDps,
		MaxHit:         result.MaxHit,
		Accuracy:       result.Accuracy,
		AttackRoll:     result.AttackRoll,
	}
}
