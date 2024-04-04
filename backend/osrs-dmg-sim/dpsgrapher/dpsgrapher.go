package dpsgrapher

import (
	"slices"
	"strconv"

	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/dpscalc"
)

type DpsGrapherResults struct {
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

const (
	AttackLevel     GraphType = "Attack"
	StrengthLevel   GraphType = "Strength"
	RangedLevel     GraphType = "Ranged"
	MagicLevel      GraphType = "Magic"
	TeamSize        GraphType = "Team size"
	DragonWarhammer GraphType = "Dragon warhammer"
	Arclight        GraphType = "Arclight"
	BandosGodsword  GraphType = "Bandos godsword"
	AccursedSceptre GraphType = "Accursed sceptre"
	ToaRaidLevel    GraphType = "TOA raid level"
	NpcHitpoints    GraphType = "Npc hitpoints" //TODO
)

// TODO kinda scuffed
var allGraphTypes = []GraphType{AttackLevel, StrengthLevel, RangedLevel, MagicLevel, TeamSize, DragonWarhammer, Arclight, BandosGodsword, AccursedSceptre, ToaRaidLevel}
var statDrainGraphTypes = []GraphType{DragonWarhammer, Arclight, BandosGodsword, AccursedSceptre}
var levelGraphTypes = []GraphType{AttackLevel, StrengthLevel, RangedLevel, MagicLevel}

const (
	maxLevel        = 99
	maxToaRaidLevel = 600
)

func RunDpsGrapher(inputSetup *dpscalc.InputSetup) *DpsGrapherResults {
	dpsGrapherResults := DpsGrapherResults{make([]DpsGrapherResult, 0, len(allGraphTypes))}
	npcId, _ := strconv.Atoi(inputSetup.GlobalSettings.Npc.Id)

	for _, graphType := range levelGraphTypes {
		dpsGrapherResult := getLevelDpsGrapher(inputSetup, graphType)
		dpsGrapherResults.Results = append(dpsGrapherResults.Results, dpsGrapherResult)
	}

	for _, graphType := range statDrainGraphTypes {
		dpsGrapherResult := getStatDrainDpsGrapher(inputSetup, graphType)
		dpsGrapherResults.Results = append(dpsGrapherResults.Results, dpsGrapherResult)
	}

	if dpscalc.GetNpc(inputSetup.GlobalSettings.Npc.Id).IsXerician {
		dpsGrapherResult := getTeamSizeDpsGrapher(inputSetup, TeamSize)
		dpsGrapherResults.Results = append(dpsGrapherResults.Results, dpsGrapherResult)
	}
	if slices.Contains(dpscalc.ToaIds, npcId) {
		dpsGrapherResult := getToaRaidLevelDpsGrapher(inputSetup, ToaRaidLevel)
		dpsGrapherResults.Results = append(dpsGrapherResults.Results, dpsGrapherResult)
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
	xValues := getXValues(1, maxLevel)
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

		dpsGraphDatas[i] = getDpsGraphData(statChange, 1, maxLevel, &inputSetup.GlobalSettings, &inputGearSetup)
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
		npc := dpscalc.GetNpc(inputSetup.GlobalSettings.Npc.Id)
		npc.ApplyNpcScaling(&inputSetup.GlobalSettings)
		maxValue = npc.BaseCombatStats.Defence
	case AccursedSceptre:
		maxValue = 1
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
		case AccursedSceptre:
			statDrainName = dpscalc.AccursedSceptre
		}
		inputGearSetup.GearSetupSettings.StatDrain = []dpscalc.StatDrain{{Name: statDrainName, Value: 0}}
		currentValue := &inputGearSetup.GearSetupSettings.StatDrain[0].Value

		dpsGraphDatas[i] = getDpsGraphData(currentValue, 0, maxValue, &inputSetup.GlobalSettings, &inputGearSetup)
	}
	return DpsGrapherResult{string(graphType), xValues, dpsGraphDatas}
}

func getToaRaidLevelDpsGrapher(inputSetup *dpscalc.InputSetup, graphType GraphType) DpsGrapherResult {
	xValues := getXValues(0, maxToaRaidLevel)
	dpsGraphDatas := make([]DpsGraphData, len(inputSetup.InputGearSetups))

	//create a copy
	globalSettings := inputSetup.GlobalSettings
	raidLevel := &globalSettings.RaidLevel

	for i, inputGearSetup := range inputSetup.InputGearSetups {
		dpsGraphDatas[i] = getDpsGraphData(raidLevel, 1, maxToaRaidLevel, &globalSettings, &inputGearSetup)
	}
	return DpsGrapherResult{string(graphType), xValues, dpsGraphDatas}
}
