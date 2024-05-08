package biscalc

import (
	"errors"
	"fmt"
	"strconv"

	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/dpscalc"
)

type AttackStyle string

const (
	Melee  AttackStyle = "melee"
	Ranged AttackStyle = "ranged"
	Magic  AttackStyle = "magic"
)

type BisCalcInputSetup struct {
	GlobalSettings    dpscalc.GlobalSettings           `json:"globalSettings"`
	GearSetupSettings dpscalc.GearSetupSettings        `json:"gearSetupSettings"`
	Prayers           map[AttackStyle][]dpscalc.Prayer `json:"prayers"`
	IsOnSlayerTask    bool                             `json:"isOnSlayerTask"`
	IsSpecialAttack   bool                             `json:"isSpecialAttack"`
}

type BisCalcResults struct {
	Title            string          `json:"title"`
	MeleeGearSetups  []BisCalcResult `json:"meleeGearSetups"`
	RangedGearSetups []BisCalcResult `json:"rangedGearSetups"`
	MagicGearSetups  []BisCalcResult `json:"magicGearSetups"`
}

type BisCalcResult struct {
	Gear           map[dpscalc.GearSlot]dpscalc.GearItem `json:"gear"`
	AttackStyle    string                                `json:"attackStyle"`
	TheoreticalDps float32                               `json:"theoreticalDps"`
	MaxHit         []int                                 `json:"maxHit"`
	Accuracy       float32                               `json:"accuracy"`
	AttackRoll     int                                   `json:"attackRoll"`
}

type gearSetupOption map[dpscalc.GearSlot]dpscalc.GearItem //TODO gearOption
type gearSetupOptions struct {
	gearOptions gearOptions
	weapons     []weapon
	specWeapons []weapon
}

var defaultGearSetupOptions = map[AttackStyle]gearSetupOptions{
	Melee: {
		gearOptions: meleeGearOptions,
		weapons:     meleeWeapons,
		specWeapons: meleeSpecWeapons,
	},
	Ranged: {
		gearOptions: rangedGearOptions,
		weapons:     rangedWeapons,
		specWeapons: rangedSpecWeapons,
	},
	Magic: {
		gearOptions: magicGearOptions,
		weapons:     magicWeapons,
		specWeapons: magicWeapons,
	},
}

var defaultGearSetup = dpscalc.GearSetup{
	Name:            "default",
	BlowpipeDarts:   dpscalc.GearItem{Id: dragonDarts},
	CurrentHp:       1,
	IsOnSlayerTask:  false,
	IsSpecialAttack: false,
	MiningLevel:     99,
}

func RunBisDpsCalc(bisCalcSetup *BisCalcInputSetup) BisCalcResults {
	bisMelee := getBisFromGearOptions(bisCalcSetup, Melee)
	bisRanged := getBisFromGearOptions(bisCalcSetup, Ranged)
	bisMagic := getBisFromGearOptions(bisCalcSetup, Magic)

	bisCalcResults := BisCalcResults{
		Title:            dpscalc.GetDpsCalcTitle(&bisCalcSetup.GlobalSettings),
		MeleeGearSetups:  bisMelee,
		RangedGearSetups: bisRanged,
		MagicGearSetups:  bisMagic,
	}
	return bisCalcResults
}

func getBisFromGearOptions(setup *BisCalcInputSetup, attackStyle AttackStyle) []BisCalcResult {
	count := 3 //TODO?
	bisResults := make([]BisCalcResult, count)

	inputGearSetup := &dpscalc.InputGearSetup{
		GearSetupSettings: setup.GearSetupSettings,
		GearSetup:         defaultGearSetup,
	}
	gearSetup := &inputGearSetup.GearSetup
	gearSetup.Prayers = setup.Prayers[attackStyle]

	var gearOptions gearOptions = make(gearOptions)
	for gearSlot, gearOpt := range defaultGearSetupOptions[attackStyle].gearOptions {
		gearOptions[gearSlot] = gearOpt
	}

	if setup.IsOnSlayerTask {
		gearOptions[dpscalc.Head] = append(gearOptions[dpscalc.Head], slayerHelm)
		gearSetup.IsOnSlayerTask = true
	}

	weapons := defaultGearSetupOptions[attackStyle].weapons
	if setup.IsSpecialAttack {
		weapons = defaultGearSetupOptions[attackStyle].specWeapons
		gearSetup.IsSpecialAttack = true
	}

	gearOptionsNext := gearOptionsIterator(gearOptions)
	gearOption, err := gearOptionsNext()

	calcCount := 0
	runDpsCalc := func(weapon weapon, attackStyle string) {
		gearSetup.AttackStyle = attackStyle
		gearSetup.Spell = ""

		//copy gear
		var gear gearSetupOption = make(gearSetupOption)
		for gearSlot, gearItem := range gearOption {
			gear[gearSlot] = dpscalc.GearItem{Id: gearItem.Id}
		}

		for gearSlot, id := range weapon.gear {
			if id == -1 {
				delete(gear, gearSlot)
			}
			if gearSlot == dpscalc.Weapon && dpscalc.AllItems[strconv.Itoa(id)].IsTwoHand {
				delete(gear, dpscalc.Shield)
			}
			gear[gearSlot] = dpscalc.GearItem{Id: id}
		}

		gearSetup.Gear = gear
		if weapon.gearSetupMod != nil {
			weapon.gearSetupMod(gearSetup)
		}

		dpsCalcResult := dpscalc.DpsCalcGearSetup(&setup.GlobalSettings, inputGearSetup, false)
		calcCount++
		if dpsCalcResult.TheoreticalDps > bisResults[count-1].TheoreticalDps {
			newBisResult := BisCalcResult{
				Gear:           gear,
				TheoreticalDps: dpsCalcResult.TheoreticalDps,
				MaxHit:         dpsCalcResult.MaxHit,
				Accuracy:       dpsCalcResult.Accuracy,
				AttackRoll:     dpsCalcResult.AttackRoll,
				AttackStyle:    attackStyle,
			}
			for i := range bisResults {
				if dpsCalcResult.TheoreticalDps > bisResults[i].TheoreticalDps {
					for j := count - 1; j > i; j-- {
						bisResults[j] = bisResults[j-1]
					}
					bisResults[i] = newBisResult
					break
				}
			}
		}
	}

	for ; err == nil; gearOption, err = gearOptionsNext() {
		for _, weapon := range weapons {
			for _, attackStyle := range weapon.attackStyles {
				runDpsCalc(weapon, attackStyle)
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
	iteratorEmpty := false

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
		if iteratorEmpty {
			return nil, errors.New("iterator empty")
		}

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
				iteratorEmpty = true
				return currentGear, nil
			}

			gearIndices[gearSlot] = 0
			gearSlotIndex--
			gearSlot = allGearSlots[gearSlotIndex]
			gearIndices[gearSlot] += 1
		}

		return currentGear, nil
	}
}
