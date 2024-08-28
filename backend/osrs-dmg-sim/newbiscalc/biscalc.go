package newbiscalc

import (
	"fmt"

	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/dpscalc"
	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/wikidata"
)

var allItems map[int]wikidata.ItemData

type AttackStyle string

const (
	Melee  AttackStyle = "melee"
	Ranged AttackStyle = "ranged"
	Magic  AttackStyle = "magic"
)

var allAttackStyle = []AttackStyle{Melee, Ranged, Magic}

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
	Spell          string                                `json:"spell"`
	TheoreticalDps float32                               `json:"theoreticalDps"`
	MaxHit         []int                                 `json:"maxHit"`
	Accuracy       float32                               `json:"accuracy"`
	AttackRoll     int                                   `json:"attackRoll"`
}

var defaultGearSetup = dpscalc.GearSetup{
	Name:            "default",
	BlowpipeDarts:   dpscalc.GearItem{Id: dragonDarts},
	CurrentHp:       1,
	IsOnSlayerTask:  false,
	IsSpecialAttack: false,
	IsInWilderness:  false, // TODO options for this?
	IsKandarinDiary: true,
	MiningLevel:     99,
}

func init() {
	allItems = wikidata.GetWikiData(wikidata.ItemProvider).(map[int]wikidata.ItemData)
	graphs := wikidata.GetWikiData(wikidata.BisGraphProvider).(wikidata.BisGraphs)
	bisGraphs = getStyleBisGraph(graphs)
}

func RunBisCalc(setup *BisCalcInputSetup) BisCalcResults {
	options := make(map[AttackStyle]gearSetupOptions)
	inputs := make(map[AttackStyle]*dpscalc.InputGearSetup)
	for _, style := range allAttackStyle {
		opt := getGearSetupOptions(bisGraphs[style])
		opt.enrichGearSetupOptions(style, setup)
		input := getInputGearSetup(setup, style)

		options[style] = opt
		inputs[style] = &input
	}

	bisMelee := doStuff(setup, inputs[Melee], options[Melee])

	results := BisCalcResults{
		Title:            dpscalc.GetDpsCalcTitle(&setup.GlobalSettings),
		MeleeGearSetups:  bisMelee,
		RangedGearSetups: []BisCalcResult{},
		MagicGearSetups:  []BisCalcResult{},
	}
	return results
}

func getInputGearSetup(setup *BisCalcInputSetup, style AttackStyle) dpscalc.InputGearSetup {
	inputGearSetup := dpscalc.InputGearSetup{
		GearSetupSettings: setup.GearSetupSettings,
		GearSetup:         defaultGearSetup,
	}
	inputGearSetup.GearSetup.Prayers = setup.Prayers[style]
	inputGearSetup.GearSetup.IsSpecialAttack = setup.IsSpecialAttack
	inputGearSetup.GearSetup.IsOnSlayerTask = setup.IsOnSlayerTask
	return inputGearSetup
}

// func for main iterator
func doStuff(setup *BisCalcInputSetup, inputGearSetup *dpscalc.InputGearSetup, options gearSetupOptions) []BisCalcResult {
	count := 3 //TODO?
	bisResults := make([]BisCalcResult, count)

	optionsNext := gearSetupOptionsIterator(options)
	gearOption, err := optionsNext()

	calcCount := 0
	//TODO also iter att style
	for ; err == nil; gearOption, err = optionsNext() {
		attackStyles := dpscalc.WeaponStyles[allItems[gearOption[dpscalc.Weapon].Id].WeaponCategory]

		inputGearSetup.GearSetup.Gear = gearOption //TOOD copy???
		inputGearSetup.GearSetup.Spell = ""
		inputGearSetup.GearSetup.AttackStyle = attackStyles[0].Name

		//TODO filter out invalid setups

		dpsCalcResult := dpscalc.DpsCalcGearSetup(&setup.GlobalSettings, inputGearSetup, false)

		calcCount++
		if calcCount%10000 == 0 {
			fmt.Println(calcCount)
		}

		// fmt.Println("dps: ", dpsCalcResult.TheoreticalDps)
		if dpsCalcResult.TheoreticalDps > bisResults[count-1].TheoreticalDps {
			newBisResult := BisCalcResult{
				Gear:           gearOption.clone(), //TODO copy here??
				Spell:          "",
				TheoreticalDps: dpsCalcResult.TheoreticalDps,
				MaxHit:         dpsCalcResult.MaxHit,
				Accuracy:       dpsCalcResult.Accuracy,
				AttackRoll:     dpsCalcResult.AttackRoll,
				AttackStyle:    "combatOptionName",
			}
			updateBisResult(newBisResult, bisResults)
		}

	}

	fmt.Println("Total calcs: ", calcCount)
	return bisResults
}

func updateBisResult(newResult BisCalcResult, results []BisCalcResult) {
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
