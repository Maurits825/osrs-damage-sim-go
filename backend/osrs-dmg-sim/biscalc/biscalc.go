package biscalc

import (
	"errors"
	"fmt"
	"slices"

	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/dpscalc"
	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/wikidata"
)

type AttackStyle string

const (
	Melee  AttackStyle = "melee"
	Ranged AttackStyle = "ranged"
	Magic  AttackStyle = "magic"
)

var allAttackStyles = []AttackStyle{Melee, Ranged, Magic}

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
	weapons     []int
	specWeapons []int
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

var allItems map[int]wikidata.ItemData

func init() {
	allItems = wikidata.GetItemData()
}

func RunBisDpsCalc(bisCalcSetup *BisCalcInputSetup, inputGearOpts map[AttackStyle]gearSetupOptions) BisCalcResults {
	gearSetupOptions := inputGearOpts
	if gearSetupOptions == nil {
		gearSetupOptions = defaultGearSetupOptions
	} else {
		//add blessing to allow a slot for thrown weapons
		gearSetupOptions[Ranged].gearOptions[dpscalc.Ammo] = append(gearSetupOptions[Ranged].gearOptions[dpscalc.Ammo], radaBlessing)
	}

	bisMelee := getBisFromGearOptions(bisCalcSetup, Melee, gearSetupOptions)
	bisRanged := getBisFromGearOptions(bisCalcSetup, Ranged, gearSetupOptions)
	bisMagic := getBisFromGearOptions(bisCalcSetup, Magic, gearSetupOptions)

	bisCalcResults := BisCalcResults{
		Title:            dpscalc.GetDpsCalcTitle(&bisCalcSetup.GlobalSettings),
		MeleeGearSetups:  bisMelee,
		RangedGearSetups: bisRanged,
		MagicGearSetups:  bisMagic,
	}
	return bisCalcResults
}

func getBisFromGearOptions(setup *BisCalcInputSetup, attackStyle AttackStyle, gearSetupOptions map[AttackStyle]gearSetupOptions) []BisCalcResult {
	count := 3 //TODO?
	bisResults := make([]BisCalcResult, count)

	inputGearSetup := &dpscalc.InputGearSetup{
		GearSetupSettings: setup.GearSetupSettings,
		GearSetup:         defaultGearSetup,
	}
	gearSetup := &inputGearSetup.GearSetup
	gearSetup.Prayers = setup.Prayers[attackStyle]

	var gearOptions gearOptions = make(gearOptions)
	for gearSlot, gearOpt := range gearSetupOptions[attackStyle].gearOptions {
		gearOptions[gearSlot] = gearOpt
	}
	gearOptions[dpscalc.Weapon] = gearSetupOptions[attackStyle].weapons
	if setup.IsSpecialAttack {
		gearOptions[dpscalc.Weapon] = gearSetupOptions[attackStyle].specWeapons
	}

	if setup.IsOnSlayerTask {
		//TODO maybe include by default, we need a special filter for these items in gearjson
		gearOptions[dpscalc.Head] = append(gearOptions[dpscalc.Head], slayerHelm)
		gearSetup.IsOnSlayerTask = true
	}

	//there is no ammo slot that increases melee/magic?
	if attackStyle != Ranged {
		delete(gearOptions, dpscalc.Ammo)
	}

	gearOptionsNext := gearOptionsIterator(gearOptions)
	gearOption, err := gearOptionsNext()

	calcCount := 0
	runDpsCalc := func(combatOptionName string, spell string) {
		gearSetup.AttackStyle = combatOptionName
		gearSetup.Spell = spell

		//copy gear
		var gear gearSetupOption = make(gearSetupOption)
		for gearSlot, gearItem := range gearOption {
			gear[gearSlot] = dpscalc.GearItem{Id: gearItem.Id}
		}

		weaponId := gearOption[dpscalc.Weapon].Id
		//remove shield if 2h
		if allItems[weaponId].Is2h {
			delete(gear, dpscalc.Shield)
		}

		if weaponId == blowpipe || weaponId == bowfa {
			delete(gear, dpscalc.Ammo)
		}

		//TODO invalidate setups here like blowpipe with different ammo types, same dps so could save bunch of calcs
		if !isGearSetupOptionValid(gearOption) {
			return
		}

		gearSetup.Gear = gear

		dpsCalcResult := dpscalc.DpsCalcGearSetup(&setup.GlobalSettings, inputGearSetup, false)
		calcCount++
		if calcCount%50000 == 0 {
			fmt.Println(calcCount)
		}
		if dpsCalcResult.TheoreticalDps > bisResults[count-1].TheoreticalDps {
			newBisResult := BisCalcResult{
				Gear:           gear,
				TheoreticalDps: dpsCalcResult.TheoreticalDps,
				MaxHit:         dpsCalcResult.MaxHit,
				Accuracy:       dpsCalcResult.Accuracy,
				AttackRoll:     dpsCalcResult.AttackRoll,
				AttackStyle:    combatOptionName,
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
		attackStyles := dpscalc.WeaponStyles[allItems[gearOption[dpscalc.Weapon].Id].WeaponCategory]
		for _, attackStyle := range attackStyles {
			if attackStyle.StyleStance == dpscalc.Autocast {
				for _, spell := range []string{"Fire Surge"} {
					runDpsCalc(attackStyle.Name, spell)
				}
			}
			runDpsCalc(attackStyle.Name, "")
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

var bolts = []int{rubyDragonBolts}
var arrows = []int{dragonArrows}

func isGearSetupOptionValid(gear gearSetupOption) bool {
	weaponId := gear[dpscalc.Weapon].Id

	//check ammo
	switch allItems[weaponId].WeaponCategory {
	case "CROSSBOW":
		if !slices.Contains(bolts, gear[dpscalc.Ammo].Id) {
			return false
		}
	case "BOW":
		if !slices.Contains(arrows, gear[dpscalc.Ammo].Id) {
			return false
		}
	case "THROWN", "CHINCHOMPAS":
		if gear[dpscalc.Ammo].Id != radaBlessing {
			return false
		}
	}

	//TODO other checks?
	return true
}
