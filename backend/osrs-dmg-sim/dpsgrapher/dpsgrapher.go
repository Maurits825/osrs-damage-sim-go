package dpsgrapher

import (
	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/dpscalc"
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

// TODO more graph types, stat drains next?? how to implement this
const (
	AttackLevel   GraphType = "Attack"
	StrengthLevel GraphType = "Strength"
	RangedLevel   GraphType = "Ranged"
	MagicLevel    GraphType = "Magic"
)

// TODO kinda scuffed
var graphTypes = []GraphType{AttackLevel, StrengthLevel, RangedLevel, MagicLevel}

const (
	MaxLevel = 99
)

func RunDpsGrapher(inputSetup *dpscalc.InputSetup) *DpsGrapherResults {
	dpsGrapherResults := DpsGrapherResults{"some title", make([]DpsGrapherResult, len(graphTypes))}

	for i, graphType := range graphTypes {
		dpsGrapherResult := DpsGrapherResult{}
		switch graphType {
		case AttackLevel, StrengthLevel, RangedLevel, MagicLevel:
			dpsGrapherResult = getLevelDpsGrapher(inputSetup, graphType)
		}
		dpsGrapherResults.Results[i] = dpsGrapherResult
	}

	return &dpsGrapherResults
}

func getLevelDpsGrapher(inputSetup *dpscalc.InputSetup, graphType GraphType) DpsGrapherResult {
	xValues := make([]float32, MaxLevel)
	for level := 1; level <= MaxLevel; level++ {
		xValues[level-1] = float32(level)
	}
	dpsGraphDatas := make([]DpsGraphData, len(inputSetup.InputGearSetups))

	var statChange *int
	//loop here creates a copy of the slice
	for i, inputGearSetup := range inputSetup.InputGearSetups {
		switch graphType {
		case AttackLevel:
			statChange = &inputGearSetup.GearSetupSettings.CombatStats.Attack
		case StrengthLevel:
			statChange = &inputGearSetup.GearSetupSettings.CombatStats.Strength
		case RangedLevel:
			statChange = &inputGearSetup.GearSetupSettings.CombatStats.Ranged
		case MagicLevel:
			statChange = &inputGearSetup.GearSetupSettings.CombatStats.Magic
		}

		dps := make([]float32, MaxLevel)
		for level := 1; level <= MaxLevel; level++ {
			*statChange = level
			dpsCalcResult := dpscalc.DpsCalcGearSetup(&inputSetup.GlobalSettings, &inputGearSetup, false)
			dps[level-1] = dpsCalcResult.TheoreticalDps
		}
		dpsGraphDatas[i] = DpsGraphData{Label: inputGearSetup.GearSetup.Name, Dps: dps}
	}
	return DpsGrapherResult{string(graphType), xValues, dpsGraphDatas}
}
