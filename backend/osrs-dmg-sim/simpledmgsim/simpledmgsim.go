package simpledmgsim

type SimpleDmgSimResults struct {
	Results string `json:"results"`
}

func RunSimpleDmgSim(inputSetup *InputSetup) *SimpleDmgSimResults {
	return &SimpleDmgSimResults{Results: "run some sim zog"}
}
