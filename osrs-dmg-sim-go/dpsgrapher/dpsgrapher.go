package dpsgrapher

import (
	"github.com/Maurits825/osrs-damage-sim/osrs-dmg-sim-go/dpscalc"
)

type DpsGrapherResults struct {
	Title   string             `json:"title"`
	Results []DpsGrapherResult `json:"results"`
}

type DpsGrapherResult struct {
	GraphType string         `json:"graphType"`
	XValues   []float32      `json:"xValues"`
	DpsData   []DpsGraphData `json:"dpsData"`
}

type DpsGraphData struct {
	Label string    `json:"label"`
	Dps   []float32 `json:"dps"`
}

type GraphType string

const (
	AttackLevel   GraphType = "Attack"
	StrengthLevel GraphType = "Strength"
)

// TODO kinda scuffed
var graphTypes = []GraphType{AttackLevel, StrengthLevel}

const (
	MaxLevel = 10 //TODO set to 99!
)

func RunDpsGrapher(inputSetup *dpscalc.InputSetup) *DpsGrapherResults {
	dpsGrapherResults := DpsGrapherResults{"some title", make([]DpsGrapherResult, len(graphTypes))}

	for i, graphType := range graphTypes {
		dpsGrapherResult := DpsGrapherResult{}
		switch graphType {
		case AttackLevel, StrengthLevel:
			dpsGrapherResult = getLevelDpsGrapher(inputSetup, graphType)
		}
		dpsGrapherResults.Results[i] = dpsGrapherResult
	}

	return &dpsGrapherResults
}

func getLevelDpsGrapher(inputSetup *dpscalc.InputSetup, graphType GraphType) DpsGrapherResult {
	dpsGraphDatas := make([]DpsGraphData, len(inputSetup.InputGearSetups))
	for i, inputGearSetup := range inputSetup.InputGearSetups {
		dpsGraphDatas[i] = DpsGraphData{Label: inputGearSetup.GearSetup.Name, Dps: make([]float32, MaxLevel)}
	}
	xValues := make([]float32, MaxLevel)
	for level := 1; level <= MaxLevel; level++ {
		xValues[level-1] = float32(level)
		for _, inputGearSetup := range inputSetup.InputGearSetups {
			//just update the input setup for now, could be done better
			switch graphType {
			case AttackLevel:
				inputGearSetup.GearSetupSettings.CombatStats.Attack = level
			case StrengthLevel:
				inputGearSetup.GearSetupSettings.CombatStats.Strength = level
			}
		}
		dpsCalcResult := dpscalc.RunDpsCalc(inputSetup)
		for i, dpsCalcResult := range dpsCalcResult.Results {
			dpsGraphDatas[i].Dps[level-1] = dpsCalcResult.TheoreticalDps

		}
	}

	return DpsGrapherResult{string(graphType), xValues, dpsGraphDatas}
}
