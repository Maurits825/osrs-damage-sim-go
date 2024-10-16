package simpledmgsim

type SimpleDmgSimResults struct {
	Results string `json:"results"`
}

type Npc struct {
	Id        string `json:"id"`
	Hitpoints int    `json:"hitpoints"`
}

type CoxScaling struct {
	PartyMaxCombatLevel int  `json:"partyMaxCombatLevel"`
	PartyAvgMiningLevel int  `json:"partyAvgMiningLevel"`
	PartyMaxHpLevel     int  `json:"partyMaxHpLevel"`
	IsChallengeMode     bool `json:"isChallengeMode"`
}

type GlobalSettings struct {
	Npc            Npc        `json:"npc"`
	NpcHitpoints   int        `json:"npcHitpoints"`
	TeamSize       int        `json:"teamSize"`
	RaidLevel      int        `json:"raidLevel"`
	PathLevel      int        `json:"pathLevel"`
	OverlyDraining bool       `json:"overlyDraining"`
	CoxScaling     CoxScaling `json:"coxScaling"`
}

type InputSetup struct {
	GlobalSettings GlobalSettings `json:"globalSettings"`
	//todo
	// gearPresets  []InputGearSetup `json:"gearPresets"`
	// inputGearSetups inputGearSetups `json:"inputGearSetups"`
}

func RunSimpleDmgSim(inputSetup *InputSetup) *SimpleDmgSimResults {
	return &SimpleDmgSimResults{Results: "run some sim zog"}
}
