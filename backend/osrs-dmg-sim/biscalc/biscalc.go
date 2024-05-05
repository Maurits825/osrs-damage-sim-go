package biscalc

import (
	"errors"
	"fmt"

	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/dpscalc"
)

type BisCalcSetup struct {
	GlobalSettings    dpscalc.GlobalSettings    `json:"globalSettings"`
	GearSetupSettings dpscalc.GearSetupSettings `json:"gearSetupSettings"`
}

type BisCalcResults struct {
	Title           string          `json:"title"`
	MeleeGearSetups []BisCalcResult `json:"meleeGearSetups"`
	MagicGearSetups []BisCalcResult `json:"magicGearSetups"`
}

type BisCalcResult struct {
	Gear           map[dpscalc.GearSlot]dpscalc.GearItem `json:"gear"`
	AttackStyle    string                                `json:"attackStyle"`
	TheoreticalDps float32                               `json:"theoreticalDps"`
	MaxHit         []int                                 `json:"maxHit"`
	Accuracy       float32                               `json:"accuracy"`
	AttackRoll     int                                   `json:"attackRoll"`
}

type gearSetupOption map[dpscalc.GearSlot]dpscalc.GearItem

var defaultGearSetup = dpscalc.GearSetup{
	Name:            "default",
	BlowpipeDarts:   dpscalc.GearItem{Id: 11230},
	CurrentHp:       1,
	IsSpecialAttack: false,
	MiningLevel:     99,
}

func RunBisDpsCalc(bisCalcSetup *BisCalcSetup) BisCalcResults {
	bisMelee := getBisFromGearOptions(bisCalcSetup, meleeGearOptions, 3)

	bisCalcResults := BisCalcResults{
		Title:           dpscalc.GetDpsCalcTitle(&bisCalcSetup.GlobalSettings),
		MeleeGearSetups: bisMelee,
		MagicGearSetups: bisMelee,
	}
	//TODO remove
	bisCalcResults.MagicGearSetups[0] = bisCalcResults.MeleeGearSetups[0]

	return bisCalcResults
}

func getBisFromGearOptions(bisCalcSetup *BisCalcSetup, gearOptions gearOptions, count int) []BisCalcResult {
	bisResults := make([]BisCalcResult, count)

	inputGearSetup := &dpscalc.InputGearSetup{
		GearSetupSettings: bisCalcSetup.GearSetupSettings,
		GearSetup:         defaultGearSetup,
	}
	gearSetup := &inputGearSetup.GearSetup
	//TODO prayers in input
	gearSetup.Prayers = []dpscalc.Prayer{dpscalc.PietyPrayer}

	maxDps := make([]float32, count)
	calcCount := 0

	gearOptionsNext := gearOptionsIterator(gearOptions)
	gearOption, err := gearOptionsNext()
	for ; err == nil; gearOption, err = gearOptionsNext() {
		for _, weapon := range meleeWeapons {
			for _, attackStyle := range weapon.attackStyles {
				gearSetup.AttackStyle = attackStyle

				//copy gear
				var gear gearSetupOption = make(gearSetupOption)
				for gearSlot, gearItem := range gearOption {
					gear[gearSlot] = dpscalc.GearItem{Id: gearItem.Id}
				}

				for gearSlot, id := range weapon.gear {
					if id == -1 {
						delete(gear, gearSlot)
					}
					gear[gearSlot] = dpscalc.GearItem{Id: id}
				}
				gearSetup.Gear = gear

				dpsCalcResult := dpscalc.DpsCalcGearSetup(&bisCalcSetup.GlobalSettings, inputGearSetup, false)
				calcCount++
				if dpsCalcResult.TheoreticalDps > maxDps[count-1] {
					newBisResult := BisCalcResult{
						Gear:           gear,
						TheoreticalDps: dpsCalcResult.TheoreticalDps,
						MaxHit:         dpsCalcResult.MaxHit,
						Accuracy:       dpsCalcResult.Accuracy,
						AttackRoll:     dpsCalcResult.AttackRoll,
						AttackStyle:    attackStyle,
					}
					for i, mDps := range maxDps {
						if dpsCalcResult.TheoreticalDps > mDps {
							maxDps[i] = dpsCalcResult.TheoreticalDps
							for j := count - 1; j > i; j-- {
								bisResults[j] = bisResults[j-1]
							}
							bisResults[i] = newBisResult
							break
						}
					}
				}
			}
		}
	}

	fmt.Println("Total calcs: ", calcCount)
	return bisResults
}

var allGearSlots = []dpscalc.GearSlot{
	dpscalc.Head,
	dpscalc.Cape,
	dpscalc.Neck,
	dpscalc.Weapon,
	dpscalc.Body,
	dpscalc.Shield,
	dpscalc.Legs,
	dpscalc.Hands,
	dpscalc.Feet,
	dpscalc.Ring,
	dpscalc.Ammo,
}

func gearOptionsIterator(gearOptions gearOptions) func() (gearSetupOption, error) {
	var currentGear gearSetupOption = make(gearSetupOption)

	var gearIndices map[dpscalc.GearSlot]int = make(map[dpscalc.GearSlot]int)
	var gearLengths map[dpscalc.GearSlot]int = make(map[dpscalc.GearSlot]int)
	for _, slot := range allGearSlots {
		ids, ok := gearOptions[slot]
		gearIndices[slot] = 0
		gearLengths[slot] = len(ids)
		if !ok {
			gearLengths[slot] = 1
		}
	}

	gearSlotIndex := len(allGearSlots) - 1
	lastGearSlotIndex := gearSlotIndex

	return func() (gearSetupOption, error) {
		//get current gear based on indices
		for _, slot := range allGearSlots {
			ids, ok := gearOptions[slot]
			if ok {
				id := ids[gearIndices[slot]]
				currentGear[slot] = dpscalc.GearItem{Id: id}
			}
		}

		//update indices
		gearIndices[allGearSlots[lastGearSlotIndex]] += 1
		gearSlotIndex = lastGearSlotIndex
		gearSlot := allGearSlots[gearSlotIndex]
		for gearIndices[gearSlot] == gearLengths[gearSlot] {
			//iterator is empty
			if gearSlotIndex == 0 {
				return nil, errors.New("iterator empty")
			}

			gearIndices[gearSlot] = 0
			gearSlotIndex--
			gearSlot = allGearSlots[gearSlotIndex]
			gearIndices[gearSlot] += 1
		}

		return currentGear, nil
	}
}
