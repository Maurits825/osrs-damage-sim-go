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
	AttackLevel     GraphType = "Attack"
	StrengthLevel   GraphType = "Strength"
	RangedLevel     GraphType = "Ranged"
	MagicLevel      GraphType = "Magic"
	TeamSize        GraphType = "Team size"
	DragonWarhammer GraphType = "Dragon warhammer"
	Arclight        GraphType = "Arclight"
	BandosGodsword  GraphType = "Bandos godsword"
)

// TODO kinda scuffed
var graphTypes = []GraphType{AttackLevel, StrengthLevel, RangedLevel, MagicLevel, TeamSize, DragonWarhammer, Arclight, BandosGodsword}

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
		case TeamSize:
			dpsGrapherResult = getTeamSizeDpsGrapher(inputSetup, graphType)
		case DragonWarhammer, Arclight, BandosGodsword:
			dpsGrapherResult = getStatDrainDpsGrapher(inputSetup, graphType)
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

func getTeamSizeDpsGrapher(inputSetup *dpscalc.InputSetup, graphType GraphType) DpsGrapherResult {
	maxTeamSize := 10 //TODO get this based on npc id?
	xValues := make([]float32, maxTeamSize)
	for t := 1; t <= maxTeamSize; t++ {
		xValues[t-1] = float32(t)
	}
	dpsGraphDatas := make([]DpsGraphData, len(inputSetup.InputGearSetups))

	globalSettings := inputSetup.GlobalSettings
	teamSize := &globalSettings.TeamSize

	for i, inputGearSetup := range inputSetup.InputGearSetups {
		dps := make([]float32, maxTeamSize)
		for t := 1; t <= maxTeamSize; t++ {
			*teamSize = t
			dpsCalcResult := dpscalc.DpsCalcGearSetup(&inputSetup.GlobalSettings, &inputGearSetup, false)
			dps[t-1] = dpsCalcResult.TheoreticalDps
		}
		dpsGraphDatas[i] = DpsGraphData{Label: inputGearSetup.GearSetup.Name, Dps: dps}
	}
	return DpsGrapherResult{string(graphType), xValues, dpsGraphDatas}
}

func getStatDrainDpsGrapher(inputSetup *dpscalc.InputSetup, graphType GraphType) DpsGrapherResult {
	maxValue := 10
	switch graphType {
	case DragonWarhammer:
		maxValue = 10
	case Arclight:
		maxValue = 10
	case BandosGodsword:
		maxValue = 200 //TODO dpscalc.AllNpcs[inputSetup.GlobalSettings.Npc.Id].combatStats.Defence
	}

	xValues := make([]float32, maxValue)
	for v := 0; v < maxValue; v++ {
		xValues[v] = float32(v)
	}
	dpsGraphDatas := make([]DpsGraphData, len(inputSetup.InputGearSetups))

	//loop here creates a copy of the slice
	for i, inputGearSetup := range inputSetup.InputGearSetups {
		dps := make([]float32, maxValue)

		var statDrainName dpscalc.StatDrainWeapon
		switch graphType {
		case DragonWarhammer:
			statDrainName = dpscalc.DragonWarhammer
		case Arclight:
			statDrainName = dpscalc.Arclight
		case BandosGodsword:
			statDrainName = dpscalc.BandosGodsword
		}
		inputGearSetup.GearSetupSettings.StatDrain = []dpscalc.StatDrain{{Name: statDrainName, Value: 0}}
		currentValue := &inputGearSetup.GearSetupSettings.StatDrain[0].Value

		//could make a fn, and also round dps to like 2decimals, check if it reduces json response size
		for v := 0; v < maxValue; v++ {
			*currentValue = v
			dpsCalcResult := dpscalc.DpsCalcGearSetup(&inputSetup.GlobalSettings, &inputGearSetup, false)
			dps[v] = dpsCalcResult.TheoreticalDps
		}
		dpsGraphDatas[i] = DpsGraphData{Label: inputGearSetup.GearSetup.Name, Dps: dps}
	}
	return DpsGrapherResult{string(graphType), xValues, dpsGraphDatas}
}
