package damagesim

import "strconv"

//TODO has snake_case json because response on FE is like that, could refactor in the future
type DpsCalcResults struct {
	Results             []DpsCalcResult `json:"results"`
	GlobalSettingsLabel string          `json:"global_settings_label"`
}

type DpsCalcResult struct {
	Labels         InputGearSetupLabels `json:"labels"`
	TheoreticalDps []float32            `json:"theoretical_dps"`
	MaxHit         []int                `json:"max_hit"`
	Accuracy       []float32            `json:"accuracy"`
}

type InputGearSetupLabels struct {
	InputGearSetupLabel    string   `json:"input_gear_setup_label"`
	GearSetupSettingsLabel string   `json:"gear_setup_settings_label"`
	AllWeaponLabels        []string `json:"all_weapon_labels"`
}

var allItems equipmentItems = loadItemWikiData()

func RunDpsCalc(inputSetup *InputSetup) *DpsCalcResults {
	dpsCalcResults := DpsCalcResults{make([]DpsCalcResult, len(inputSetup.InputGearSetups)), "Global settings label"}

	for i, inputGearSetup := range inputSetup.InputGearSetups {
		//run for just main now, will be like that in the future??
		inputGearSetupLabels := InputGearSetupLabels{
			"label", "settings label", []string{inputGearSetup.MainGearSetup.Name},
		}

		player := getPlayer(&inputSetup.GlobalSettings, &inputGearSetup)
		//TODO calc maxhit based on player?

		dps := []float32{1.23}
		//TODO can quick test
		maxHit := []int{player.equipmentStats.offensiveStats.crush}
		accuracy := []float32{87.44}
		dpsCalcResults.Results[i] = DpsCalcResult{inputGearSetupLabels, dps, maxHit, accuracy}
	}

	return &dpsCalcResults
}

//TODO maybe just have somethign that cooks the inputs
func getPlayer(globalSettings *GlobalSettings, inputGearSetup *InputGearSetup) *player {
	//first get equipped gear
	equippedGear := &equippedGear{make([]int, 0)}
	equipmentStats := equipmentStats{}
	for _, gearItem := range inputGearSetup.MainGearSetup.Gear {
		//TODO we can get the id alias here so we only have to deal with normal id versions
		itemId := gearItem.Id

		itemStats := allItems[strconv.Itoa(itemId)].equipmentStats
		equipmentStats.addStats(&itemStats)

		equippedGear.ids = append(equippedGear.ids, itemId)
	}

	//TODO isEquipped(blowpipe) -> addStats(darts)
	//TODO check toa for shadow, dhins, virtus -> these add to equipment stats

	combatStyle := parseCombatStyle(inputGearSetup.MainGearSetup.AttackStyle)

	//TODO prob other stuff to init or get here b4 running calcs

	return &player{globalSettings, inputGearSetup, equipmentStats, combatStyle}
}

//TODO
func calculateDps(player *player) (dps float32, maxHit []int, accuracy float32) {

	return 1, []int{1}, 50.65
}

func getMaxHit(player *player) {
	style := player.combatStyle.combatStyleType
	maxHit := 0

	if style == Stab || style == Slash || style == Crush {
		maxHit = getMeleeMaxHit(player)
	} else if style == Ranged {
		maxHit = getRangedMaxHit(player)
	} else if style == Magic {
		maxHit = getMagicMaxHit(player)
	}
}

//TODO -------- max hit int or []int?????????????

func getMeleeMaxHit(player *player) int {

}

func getRangedMaxHit(player *player) int {

}

func getMagicMaxHit(player *player) int {

}
