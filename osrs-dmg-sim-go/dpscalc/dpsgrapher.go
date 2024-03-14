package dpscalc

type DpsData struct {
	Label string    `json:"label"`
	Dps   []float32 `json:"dps"`
}

type DpsGraphData struct {
	XValues []float32 `json:"xValues"`
	DpsData []DpsData `json:"dpsData"`
}

// TODO graphtype type?
type DpsGrapherResult struct {
	GraphType  string       `json:"graphType"`
	GraphsData DpsGraphData `json:"graphData"`
}

func RunDpsGrapher(inputSetup *InputSetup) []DpsGrapherResult {
	xValues := []float32{1, 2, 3, 4, 5, 6, 7, 8, 9}
	dps := []float32{1, 2, 3, 4, 5, 6, 7, 8, 9}
	dpsData := DpsData{"weapon 1", dps}
	graphData := DpsGraphData{XValues: xValues, DpsData: []DpsData{dpsData}}
	dpsGrapherResults := []DpsGrapherResult{DpsGrapherResult{"Dragon warhammer", graphData}}

	return dpsGrapherResults
}
