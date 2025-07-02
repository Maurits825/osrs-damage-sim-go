package simpledmgsim

type SimpleDmgSimResults struct {
	Results []SimpleDmgSimResult `json:"results"`
}

type SimpleDmgSimResult struct {
	TicksToKill int `json:"ticksToKill"`
}

func RunSimpleDmgSim(inputSetup *InputSetup) *SimpleDmgSimResults {
	results := RunAllDistSim(inputSetup)
	return results
}
