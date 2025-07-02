package simpledmgsim

//todo name
type simResult struct {
	AverageTtk     int       `json:"averageTtk"`
	TtkHistogram   []int     `json:"ttkHistogram"`
	CummulativeTtk []float32 `json:"cummulativeTtk"`
}

func getSimResults(ttkMap map[int]int, maxTtk int, iterations int) *simResult {
	results := &simResult{
		AverageTtk:     0,
		TtkHistogram:   make([]int, maxTtk),
		CummulativeTtk: make([]float32, maxTtk),
	}

	cummulativeCount := 0
	ttkSum := 0
	for i := range maxTtk {
		ttkCount := ttkMap[i]
		cummulativeCount += ttkCount
		results.CummulativeTtk[i] = float32(cummulativeCount) / float32(iterations)

		results.TtkHistogram[i] = ttkCount

		ttkSum += ttkCount * i
	}

	results.AverageTtk = ttkSum / iterations
	return results
}
