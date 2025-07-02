package simpledmgsim

//todo remove this file?
type SimpleDmgSimResults struct {
	Results []*simResult `json:"results"`
}

func RunSimpleDmgSim(inputSetup *InputSetup) SimpleDmgSimResults {
	results := RunAllDistSim(inputSetup)
	return results
}
