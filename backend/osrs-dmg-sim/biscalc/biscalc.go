package biscalc

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
	results := make(map[AttackStyle][]BisCalcResult)
	for _, style := range allAttackStyle {
		option := getGearSetupOptions(bisGraphs[style])
		option.enrichGearSetupOptions(style, setup)
		input := getInputGearSetup(setup, style)
		result := RunDpsCalcs(setup, &input, option)
		results[style] = result
	}

	return BisCalcResults{
		Title:            dpscalc.GetDpsCalcTitle(&setup.GlobalSettings),
		MeleeGearSetups:  results[Melee],
		RangedGearSetups: results[Ranged],
		MagicGearSetups:  results[Magic],
	}
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

// TODO how to add sets like void, would be similar input to 'locking' items from FE input
// TODO if slayer task, lock in slayer helm? if undead torva+salve could be better...
// TODO otherwise perf test to make it faster
func RunDpsCalcs(setup *BisCalcInputSetup, inputGearSetup *dpscalc.InputGearSetup, options gearSetupOptions) []BisCalcResult {
	count := 3 //TODO?
	bisResults := make([]BisCalcResult, count)

	optionsNext := gearSetupOptionsIterator(options)
	gearSetup, err := optionsNext()

	calcCount := 0
	for ; err == nil; gearSetup, err = optionsNext() {
		if !gearSetup.isValid() {
			continue
		}

		combatOptions := dpscalc.WeaponStyles[allItems[gearSetup[dpscalc.Weapon].Id].WeaponCategory]

		for _, combatOption := range combatOptions {
			if combatOption.StyleStance == dpscalc.Defensive || combatOption.StyleStance == dpscalc.Longrange {
				continue
			}

			//TODO how to handle spells, if autocast then iter four elemental spells?

			inputGearSetup.GearSetup.Gear = gearSetup
			inputGearSetup.GearSetup.Spell = ""
			inputGearSetup.GearSetup.AttackStyle = combatOption.Name

			dpsCalcResult := dpscalc.DpsCalcGearSetup(&setup.GlobalSettings, inputGearSetup, false)

			calcCount++
			if calcCount%10000 == 0 {
				fmt.Println(calcCount)
			}

			if dpsCalcResult.TheoreticalDps > bisResults[count-1].TheoreticalDps {
				updateBisResult(gearSetup, inputGearSetup, &dpsCalcResult, bisResults)
			}

		}
	}

	fmt.Println("Total calcs: ", calcCount)
	return bisResults
}
