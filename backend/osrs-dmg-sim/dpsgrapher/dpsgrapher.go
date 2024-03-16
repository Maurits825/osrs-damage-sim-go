package dpsgrapher

import (
	"strconv"

	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/dpscalc"
)

type DpsGrapherResults struct {
	Title   string             `json:"title"`
	Results []DpsGrapherResult `json:"results"`
}

type DpsGrapherResult struct {
	GraphType string         `json:"graphType"`
	XValues   []string       `json:"xValues"`
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

func getDpsGraphData(value *int, startValue int, maxValue int, globalSettings *dpscalc.GlobalSettings, inputGearSetup *dpscalc.InputGearSetup) DpsGraphData {
	dps := make([]float32, (maxValue-startValue)+1)
	for v := startValue; v <= maxValue; v++ {
		*value = v
		dpsCalcResult := dpscalc.DpsCalcGearSetup(globalSettings, inputGearSetup, false)
		dps[v-startValue] = dpsCalcResult.TheoreticalDps
	}
	return DpsGraphData{Label: inputGearSetup.GearSetup.Name, Dps: dps}
}

func getXValues(startValue int, maxValue int) []string {
	xValues := make([]string, (maxValue-startValue)+1)
	for value := startValue; value <= maxValue; value++ {
		xValues[value-startValue] = strconv.Itoa(value)
	}
	return xValues
}

func getLevelDpsGrapher(inputSetup *dpscalc.InputSetup, graphType GraphType) DpsGrapherResult {
	xValues := getXValues(1, MaxLevel)
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

		dpsGraphDatas[i] = getDpsGraphData(statChange, 1, MaxLevel, &inputSetup.GlobalSettings, &inputGearSetup)
	}
	return DpsGrapherResult{string(graphType), xValues, dpsGraphDatas}
}

func getTeamSizeDpsGrapher(inputSetup *dpscalc.InputSetup, graphType GraphType) DpsGrapherResult {
	maxTeamSize := 10 //TODO get this based on npc id?
	xValues := getXValues(1, maxTeamSize)
	dpsGraphDatas := make([]DpsGraphData, len(inputSetup.InputGearSetups))

	//create a copy
	globalSettings := inputSetup.GlobalSettings
	teamSize := &globalSettings.TeamSize

	for i, inputGearSetup := range inputSetup.InputGearSetups {
		dpsGraphDatas[i] = getDpsGraphData(teamSize, 1, maxTeamSize, &globalSettings, &inputGearSetup)
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

	xValues := getXValues(0, maxValue)
	dpsGraphDatas := make([]DpsGraphData, len(inputSetup.InputGearSetups))

	//loop here creates a copy of the slice
	for i, inputGearSetup := range inputSetup.InputGearSetups {
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

		dpsGraphDatas[i] = getDpsGraphData(currentValue, 0, maxValue, &inputSetup.GlobalSettings, &inputGearSetup)
	}
	return DpsGrapherResult{string(graphType), xValues, dpsGraphDatas}
}
