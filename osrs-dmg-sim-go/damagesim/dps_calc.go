package damagesim

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

var allItems items = loadItemWikiData()

func RunDpsCalc(inputSetup *InputSetup) *DpsCalcResults {
	dpsCalcResults := DpsCalcResults{make([]DpsCalcResult, len(inputSetup.InputGearSetups)), "Global settings label"}

	for i, inputGearSetup := range inputSetup.InputGearSetups {
		//run for just main now, will be like that in the future??
		inputGearSetupLabels := InputGearSetupLabels{"label", "settings label", []string{inputGearSetup.MainGearSetup.Name}}
		//TODO calc using in inputGearSetup.MainGearSetUp....
		dps := []float32{1.23}
		maxHit := []int{50}
		accurarcy := []float32{87.44}
		dpsCalcResult := DpsCalcResult{inputGearSetupLabels, dps, maxHit, accurarcy}
		dpsCalcResults.Results[i] = dpsCalcResult
	}

	return &dpsCalcResults
}
