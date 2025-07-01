package simpledmgsim

type SimpleDmgSimResults struct {
	Results []SimpleDmgSimResult `json:"results"`
}

type SimpleDmgSimResult struct {
	TicksToKill int `json:"ticksToKill"`
}

func RunSimpleDmgSim(inputSetup *InputSetup) *SimpleDmgSimResults {
	//TODO
	//prob need to get player from dpscalc, have to expose the structs and fn and stuff
	//dps calc can have alot of shared stuff, dpsgrapher/dmgsim then depend on it
	// results := RunSim(inputSetup.GearPresets, &inputSetup.GlobalSettings, inputSetup.InputGearSetups[0])

	iterations := 1 //1_000_000
	runner := newDistSimRunner(iterations, nil)
	results := runner.runDistSim(inputSetup.GearPresets, &inputSetup.GlobalSettings, inputSetup.InputGearSetups[0])

	return &SimpleDmgSimResults{Results: []SimpleDmgSimResult{{TicksToKill: results.ticksToKill}}}
}
