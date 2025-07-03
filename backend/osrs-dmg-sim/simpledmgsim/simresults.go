package simpledmgsim

//todo name
type simResult struct {
	AverageTtk     int           `json:"averageTtk"`
	MaxTtk         int           `json:"maxTtk"`
	MinTtk         int           `json:"minTtk"`
	TtkHistogram   []int         `json:"ttkHistogram"`
	CummulativeTtk []float32     `json:"cummulativeTtk"`
	DetailedRuns   []detailedRun `json:"detailedRuns"`
}

func getSimResults(ttkMap map[int]int, maxTtk, minTtk int, runner *distSimRunner) *simResult {
	var detailedRuns []detailedRun
	if runner.detailedRunLogger != nil {
		detailedRuns = []detailedRun{
			runner.detailedRunLogger.minRun,
			runner.detailedRunLogger.maxRun,
		}
	}

	results := &simResult{
		AverageTtk:     0,
		MaxTtk:         maxTtk,
		MinTtk:         minTtk,
		TtkHistogram:   make([]int, maxTtk),
		CummulativeTtk: make([]float32, maxTtk),
		DetailedRuns:   detailedRuns,
	}

	cummulativeCount := 0
	ttkSum := 0
	for i := range maxTtk {
		ttkCount := ttkMap[i]
		cummulativeCount += ttkCount
		results.CummulativeTtk[i] = float32(cummulativeCount) / float32(runner.iterations)

		results.TtkHistogram[i] = ttkCount

		ttkSum += ttkCount * i
	}

	results.AverageTtk = ttkSum / runner.iterations
	return results
}
