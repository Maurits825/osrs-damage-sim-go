package biscalc

import (
	"fmt"
	"slices"

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
	results := make(map[dpscalc.CombatStyleType][]BisCalcResult)
	for _, style := range dpscalc.AllCombatStyleTypes {
		option := getGearSetupOptions(bisGraphs[style])
		option.enrichGearSetupOptions(style, setup)
		input := getInputGearSetup(setup, style)
		result := RunDpsCalcs(setup, &input, option, style)
		results[style] = result
	}

	meleeResults := aggregateBisResults(results, []dpscalc.CombatStyleType{dpscalc.Slash, dpscalc.Stab, dpscalc.Crush}, 3)
	return BisCalcResults{
		Title:            dpscalc.GetDpsCalcTitle(&setup.GlobalSettings),
		MeleeGearSetups:  meleeResults,
		RangedGearSetups: results[dpscalc.Ranged],
		MagicGearSetups:  results[dpscalc.Magic],
	}
}

func getInputGearSetup(setup *BisCalcInputSetup, style dpscalc.CombatStyleType) dpscalc.InputGearSetup {
	inputGearSetup := dpscalc.InputGearSetup{
		GearSetupSettings: setup.GearSetupSettings,
		GearSetup:         defaultGearSetup,
	}
	if style.IsMeleeStyle() {
		inputGearSetup.GearSetup.Prayers = setup.Prayers[Melee]
	} else if style == dpscalc.Ranged {
		inputGearSetup.GearSetup.Prayers = setup.Prayers[Ranged]
	} else {
		inputGearSetup.GearSetup.Prayers = setup.Prayers[Magic]
	}

	inputGearSetup.GearSetup.IsSpecialAttack = setup.IsSpecialAttack
	inputGearSetup.GearSetup.IsOnSlayerTask = setup.IsOnSlayerTask
	return inputGearSetup
}

// TODO add locking gear from FE input
func RunDpsCalcs(setup *BisCalcInputSetup, inputGearSetup *dpscalc.InputGearSetup, options gearSetupOptions, style dpscalc.CombatStyleType) []BisCalcResult {
	count := 3 //TODO?
	bisResults := make([]BisCalcResult, count)

	optionsNext := gearSetupOptionsIterator(options)
	gearSetup, err := optionsNext()

	calcCount := 0
	for ; err == nil; gearSetup, err = optionsNext() {
		if !gearSetup.isValid() {
			continue
		}

		combatOptions := getCombatOptions(gearSetup, style)

		for _, combatOption := range combatOptions {
			spells := []string{""}
			if combatOption.StyleStance == dpscalc.Autocast {
				spells = surgeSpells
			}

			for _, spell := range spells {
				inputGearSetup.GearSetup.Gear = gearSetup
				inputGearSetup.GearSetup.Spell = spell
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
	}

	fmt.Println(style, "calcs:", calcCount)
	return bisResults
}

func getCombatOptions(gear gearSetup, style dpscalc.CombatStyleType) []dpscalc.CombatOption {
	allCombatOptions := dpscalc.WeaponStyles[allItems[gear[dpscalc.Weapon].Id].WeaponCategory]
	combatOptions := make([]dpscalc.CombatOption, 0)
	for _, combatOption := range allCombatOptions {
		if combatOption.StyleType != style {
			continue
		}

		if combatOption.StyleStance == dpscalc.Defensive || combatOption.StyleStance == dpscalc.Longrange {
			continue
		}

		if slices.Contains(combatOptions, combatOption) {
			continue
		}

		combatOptions = append(combatOptions, combatOption)
	}

	return combatOptions
}
func aggregateBisResults(results map[dpscalc.CombatStyleType][]BisCalcResult, styles []dpscalc.CombatStyleType, count int) []BisCalcResult {
	bisResults := make([]BisCalcResult, count)
	for _, style := range styles {
		for i := range results[style] {
			insertBisResult(results[style][i], bisResults)
		}
	}

	return bisResults
}
