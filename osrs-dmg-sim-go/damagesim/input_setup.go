package damagesim

//TODO this is all the request body, not what willbe used internally i guess?

type Npc struct {
	Id string `json:"id"`
}

//TODO maybe some changes here, we dont need iterations of detailed run if its just a dps calc, could have different request body?
//TODO also could have the grapher settings here? or another root
type GlobalSettings struct {
	Npc                Npc  `json:"npc"`
	TeamSize           int  `json:"teamSize"`
	Iterations         int  `json:"iterations"`
	RaidLevel          int  `json:"raidLevel"`
	PathLevel          int  `json:"pathLevel"`
	OverlyDraining     bool `json:"overlyDraining"`
	IsCoxChallengeMode bool `json:"isCoxChallengeMode"`
	IsDetailedRun      bool `json:"isDetailedRun"`
}

//TODO kinda scuffed but will require fe changes to clean up
type GearItem struct {
	Id int `json:"id"`
}

type GearSetup struct {
	Name        string           `json:"setupName"`
	AttackStyle string           `json:"attackStyle"`
	Gear        map[int]GearItem `json:"gear"`
}

type CombatStats struct {
	Attack    int `json:"attack"`
	Strength  int `json:"strength"`
	Ranged    int `json:"ranged"`
	Magic     int `json:"magic"`
	Hitpoints int `json:"hitpoints"`
}

//TODO other fields
type GearSetupSettings struct {
	CombatStats CombatStats `json:"combatStats"`
}

type InputGearSetup struct {
	GearSetupSettings GearSetupSettings `json:"gearSetupSettings"`
	MainGearSetup     GearSetup         `json:"mainGearSetup"`
	FillGearSetups    []GearSetup       `json:"fillGearSetups"`
}

type InputSetup struct {
	GlobalSettings  GlobalSettings   `json:"globalSettings"`
	InputGearSetups []InputGearSetup `json:"inputGearSetups"`
}
