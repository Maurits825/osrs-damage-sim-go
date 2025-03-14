package dpsgrapher

import (
	"slices"
	"strconv"
	"sync"

	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/dpscalc"
)

type DpsGrapherResults struct {
	Results []DpsGrapherResult `json:"results"`
}

type DpsGrapherResult struct {
	GraphType string      `json:"graphType"`
	XValues   []int       `json:"xValues"`
	GraphData []GraphData `json:"graphData"`
}

type GraphData struct {
	Label       string    `json:"label"`
	Dps         []float32 `json:"dps"`
	ExpectedHit []float32 `json:"expectedHit"`
	MaxHit      []int     `json:"maxHit"`
	Accuracy    []float32 `json:"accuracy"`
}

type GraphType string

const (
	AttackLevel     GraphType = "Attack"
	StrengthLevel   GraphType = "Strength"
	RangedLevel     GraphType = "Ranged"
	MagicLevel      GraphType = "Magic"
	TeamSize        GraphType = "Team size"
	DragonWarhammer GraphType = "Dragon warhammer"
	ElderMaul       GraphType = "Elder maul"
	Arclight        GraphType = "Arclight"
	Emberlight      GraphType = "Emberlight"
	BandosGodsword  GraphType = "Bandos godsword"
	AccursedSceptre GraphType = "Accursed sceptre"
	Ralos           GraphType = "Ralos"
	ToaRaidLevel    GraphType = "TOA raid level"
	NpcHitpoints    GraphType = "Npc hitpoints"
)

// TODO make this better?
var allGraphTypes = []GraphType{
	AttackLevel, StrengthLevel, RangedLevel, MagicLevel, TeamSize,
	DragonWarhammer, ElderMaul, Emberlight, Arclight, BandosGodsword, AccursedSceptre, Ralos,
	ToaRaidLevel,
}
var statDrainGraphTypes = []GraphType{DragonWarhammer, ElderMaul, Emberlight, Arclight, BandosGodsword, AccursedSceptre, Ralos}
var levelGraphTypes = []GraphType{AttackLevel, StrengthLevel, RangedLevel, MagicLevel}

const (
	maxLevel        = 99
	maxToaRaidLevel = 600
)

func RunDpsGrapher(inputSetup dpscalc.InputSetup) []*DpsGrapherResults {
	var results []*DpsGrapherResults
	if len(inputSetup.MultiNpcs) > 0 {
		results = make([]*DpsGrapherResults, len(inputSetup.MultiNpcs))
		for i := range inputSetup.MultiNpcs {
			inputSetup.GlobalSettings.Npc = inputSetup.MultiNpcs[i]
			calcResult := RunOneDpsGrapher(inputSetup)
			results[i] = calcResult
		}
	} else {
		results = make([]*DpsGrapherResults, 1)
		calcResult := RunOneDpsGrapher(inputSetup)
		results[0] = calcResult
	}

	return results
}

func RunOneDpsGrapher(inputSetup dpscalc.InputSetup) *DpsGrapherResults {
	npcId, _ := strconv.Atoi(inputSetup.GlobalSettings.Npc.Id)

	dpsResults := make(chan DpsGrapherResult, len(allGraphTypes))
	var wg sync.WaitGroup
	runGrapher := func(f func() DpsGrapherResult) {
		wg.Add(1)
		go func() {
			defer wg.Done()
			dpsResults <- f()
		}()
	}

	dpsDataCh := make(chan []GraphData)
	go func() {
		dpsDataCh <- getDefenceDpsResults(&inputSetup)
	}()

	runGrapher(func() DpsGrapherResult { return getNpcHitpointsDpsGrapher(&inputSetup, NpcHitpoints) })

	for _, graphType := range levelGraphTypes {
		runGrapher(func() DpsGrapherResult { return getLevelDpsGrapher(&inputSetup, graphType) })
	}

	if dpscalc.GetNpc(inputSetup.GlobalSettings.Npc.Id).IsXerician {
		runGrapher(func() DpsGrapherResult { return getTeamSizeDpsGrapher(&inputSetup, TeamSize) })
	}

	if slices.Contains(dpscalc.ToaIds, npcId) {
		runGrapher(func() DpsGrapherResult { return getToaRaidLevelDpsGrapher(&inputSetup, ToaRaidLevel) })
	}

	wg.Wait()

	close(dpsResults)

	dpsGrapherResults := DpsGrapherResults{make([]DpsGrapherResult, 0, len(allGraphTypes))}
	dpsData := <-dpsDataCh
	for _, graphType := range statDrainGraphTypes {
		statDrainResults := getStatDrainDpsGrapher(dpsData, graphType, inputSetup.GlobalSettings)
		dpsGrapherResults.Results = append(dpsGrapherResults.Results, statDrainResults)
	}

	for result := range dpsResults {
		dpsGrapherResults.Results = append(dpsGrapherResults.Results, result)
	}

	return &dpsGrapherResults
}

func getDpsGraphData(value *int, startValue int, maxValue int, globalSettings *dpscalc.GlobalSettings, inputGearSetup *dpscalc.InputGearSetup) GraphData {
	dataSize := (maxValue - startValue) + 1
	graphData := GraphData{
		Label:       inputGearSetup.GearSetup.Name,
		Dps:         make([]float32, dataSize),
		ExpectedHit: make([]float32, dataSize),
		MaxHit:      make([]int, dataSize),
		Accuracy:    make([]float32, dataSize),
	}

	calcDps := func(v int) {
		*value = v
		dpsCalcResult := dpscalc.DpsCalcGearSetup(globalSettings, inputGearSetup, nil)

		index := v - startValue
		graphData.Dps[index] = dpsCalcResult.TheoreticalDps
		graphData.ExpectedHit[index] = float32(dpsCalcResult.ExpectedHit)
		graphData.MaxHit[index] = len(dpsCalcResult.HitDist)
		graphData.Accuracy[index] = dpsCalcResult.Accuracy
	}

	for _, v := range []int{startValue, maxValue} {
		calcDps(v)
	}

	//if the first and last dps are the same, just assume they all will be to avoid unnecessary calcs
	if graphData.Dps[0] == graphData.Dps[dataSize-1] {
		for i := 0; i < dataSize; i++ {
			graphData.Dps[i] = graphData.Dps[0]
			graphData.ExpectedHit[i] = graphData.ExpectedHit[0]
			graphData.MaxHit[i] = graphData.MaxHit[0]
			graphData.Accuracy[i] = graphData.Accuracy[0]
		}
		return graphData
	}

	for v := startValue; v <= maxValue; v++ {
		calcDps(v)
	}

	return graphData
}

func getXValues(startValue int, maxValue int) []int {
	xValues := make([]int, (maxValue-startValue)+1)
	for value := startValue; value <= maxValue; value++ {
		xValues[value-startValue] = value
	}
	return xValues
}

func getLevelDpsGrapher(inputSetup *dpscalc.InputSetup, graphType GraphType) DpsGrapherResult {
	xValues := getXValues(1, maxLevel)
	dpsGraphDatas := make([]GraphData, len(inputSetup.InputGearSetups))

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
	dpsGraphDatas := make([]GraphData, len(inputSetup.InputGearSetups))

	//create a copy
	globalSettings := inputSetup.GlobalSettings
	teamSize := &globalSettings.TeamSize

	for i, inputGearSetup := range inputSetup.InputGearSetups {
		dpsGraphDatas[i] = getDpsGraphData(teamSize, 1, maxTeamSize, &globalSettings, &inputGearSetup)
	}
	return DpsGrapherResult{string(graphType), xValues, dpsGraphDatas}
}

func getDefenceDpsResults(inputSetup *dpscalc.InputSetup) []GraphData {
	npc := dpscalc.GetNpc(inputSetup.GlobalSettings.Npc.Id)
	npc.ApplyNpcScaling(&inputSetup.GlobalSettings)
	maxValue := npc.BaseCombatStats.Defence

	dpsGraphDatas := make([]GraphData, len(inputSetup.InputGearSetups))

	//loop here creates a copy of the slice
	for i, inputGearSetup := range inputSetup.InputGearSetups {
		inputGearSetup.GearSetupSettings.StatDrain = []dpscalc.StatDrain{{Name: dpscalc.BandosGodsword, Value: 0}}
		currentValue := &inputGearSetup.GearSetupSettings.StatDrain[0].Value

		dpsGraphDatas[i] = getDpsGraphData(currentValue, 0, maxValue, &inputSetup.GlobalSettings, &inputGearSetup)
	}
	return dpsGraphDatas
}

func getStatDrainDpsGrapher(statDrainData []GraphData, graphType GraphType, settings dpscalc.GlobalSettings) DpsGrapherResult {
	var statDrainName dpscalc.StatDrainWeapon
	maxValue := 10
	switch graphType {
	case DragonWarhammer:
		statDrainName = dpscalc.DragonWarhammer
	case ElderMaul:
		statDrainName = dpscalc.ElderMaul
	case Emberlight:
		statDrainName = dpscalc.Emberlight
	case Arclight:
		statDrainName = dpscalc.Arclight
	case BandosGodsword:
		statDrainName = dpscalc.BandosGodsword
		maxValue = len(statDrainData[0].Dps)
	case AccursedSceptre:
		statDrainName = dpscalc.AccursedSceptre
		maxValue = 1
	case Ralos:
		statDrainName = dpscalc.Ralos
	}

	xValues := getXValues(0, maxValue)
	graphData := make([]GraphData, len(statDrainData))
	dataSize := maxValue + 1
	for i := range statDrainData {
		data := GraphData{Label: statDrainData[i].Label,
			Dps:         make([]float32, dataSize),
			ExpectedHit: make([]float32, dataSize),
			MaxHit:      make([]int, dataSize),
			Accuracy:    make([]float32, dataSize),
		}

		for value := 0; value <= maxValue; value++ {
			npc := dpscalc.GetNpc(settings.Npc.Id)
			npc.ApplyNpcScaling(&settings)
			npc.ApplyStatDrain(&settings, []dpscalc.StatDrain{{Name: statDrainName, Value: value}})

			defIndex := npc.BaseCombatStats.Defence - npc.CombatStats.Defence
			data.Dps[value] = statDrainData[i].Dps[defIndex]
			data.ExpectedHit[value] = statDrainData[i].ExpectedHit[defIndex]
			data.MaxHit[value] = statDrainData[i].MaxHit[defIndex]
			data.Accuracy[value] = statDrainData[i].Accuracy[defIndex]
		}

		graphData[i] = data
	}

	return DpsGrapherResult{string(graphType), xValues, graphData}
}

func getToaRaidLevelDpsGrapher(inputSetup *dpscalc.InputSetup, graphType GraphType) DpsGrapherResult {
	xValues := getXValues(0, maxToaRaidLevel)
	dpsGraphDatas := make([]GraphData, len(inputSetup.InputGearSetups))

	//create a copy
	globalSettings := inputSetup.GlobalSettings
	raidLevel := &globalSettings.RaidLevel

	for i, inputGearSetup := range inputSetup.InputGearSetups {
		dpsGraphDatas[i] = getDpsGraphData(raidLevel, 0, maxToaRaidLevel, &globalSettings, &inputGearSetup)
	}
	return DpsGrapherResult{string(graphType), xValues, dpsGraphDatas}
}

func getNpcHitpointsDpsGrapher(inputSetup *dpscalc.InputSetup, graphType GraphType) DpsGrapherResult {
	npc := dpscalc.GetNpc(inputSetup.GlobalSettings.Npc.Id)
	npc.ApplyNpcScaling(&inputSetup.GlobalSettings)
	maxHitpoints := npc.BaseCombatStats.Hitpoints
	xValues := getXValues(1, maxHitpoints)
	dpsGraphDatas := make([]GraphData, len(inputSetup.InputGearSetups))

	//create a copy
	globalSettings := inputSetup.GlobalSettings
	npcHitpoints := &globalSettings.NpcHitpoints

	for i, inputGearSetup := range inputSetup.InputGearSetups {
		dpsGraphDatas[i] = getDpsGraphData(npcHitpoints, 1, maxHitpoints, &globalSettings, &inputGearSetup)
	}
	return DpsGrapherResult{string(graphType), xValues, dpsGraphDatas}
}
