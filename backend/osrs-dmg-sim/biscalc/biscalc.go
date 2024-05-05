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
	MeleeGearSetups []BisCalcResult `json:"meleeGearSetups"`
	MagicGearSetups []BisCalcResult `json:"magicGearSetups"`
}

type BisCalcResult struct {
	Gear map[dpscalc.GearSlot]dpscalc.GearItem `json:"gear"`
	Dps  float32                               `json:"dps"`
}

type gearOption map[dpscalc.GearSlot]dpscalc.GearItem

var defaultGearSetup = dpscalc.GearSetup{
	Name:            "default",
	BlowpipeDarts:   dpscalc.GearItem{Id: 11230},
	CurrentHp:       1,
	IsSpecialAttack: false,
	MiningLevel:     99,
}

func RunBisDpsCalc(bisCalcSetup *BisCalcSetup) BisCalcResults {
	inputGearSetup := &dpscalc.InputGearSetup{
		GearSetupSettings: bisCalcSetup.GearSetupSettings,
		GearSetup:         defaultGearSetup,
	}
	gearSetup := &inputGearSetup.GearSetup
	//TODO prayers in input
	gearSetup.Prayers = []dpscalc.Prayer{dpscalc.PietyPrayer}

	meleeGearOptions := gearOptionIterator(meleeGearOptions)
	maxDps := float32(0)
	var bisGear gearOption
	gear, err := meleeGearOptions()
	for ; err == nil; gear, err = meleeGearOptions() {
		for _, weapon := range meleeWeapons {
			for _, attackStyle := range weapon.attackStyles {
				gearSetup.AttackStyle = attackStyle

				for gearSlot, id := range weapon.gear {
					if id == -1 {
						delete(gear, gearSlot)
					}
					gear[gearSlot] = dpscalc.GearItem{Id: id}
				}
				gearSetup.Gear = gear

				dpsCalcResult := dpscalc.DpsCalcGearSetup(&bisCalcSetup.GlobalSettings, inputGearSetup, false)
				if dpsCalcResult.TheoreticalDps > maxDps {
					maxDps = dpsCalcResult.TheoreticalDps
					bisGear = gear
				}
			}
		}
	}

	fmt.Println("Bis: ", bisGear)
	meleeResult := BisCalcResult{Gear: bisGear, Dps: maxDps}
	return BisCalcResults{
		MeleeGearSetups: []BisCalcResult{meleeResult},
	}
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

func gearOptionIterator(gearOptions gearOptions) func() (gearOption, error) {
	var currentGear gearOption = make(gearOption)
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

	return func() (gearOption, error) {
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
