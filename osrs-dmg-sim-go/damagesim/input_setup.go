package damagesim

type GearSlot int

const (
	Head   GearSlot = 0
	Cape   GearSlot = 1
	Neck   GearSlot = 2
	Weapon GearSlot = 3
	Body   GearSlot = 4
	Shield GearSlot = 5
	Legs   GearSlot = 7
	Hands  GearSlot = 9
	Feet   GearSlot = 10
	Ring   GearSlot = 12
	Ammo   GearSlot = 13
)

// nested struct kinda nice if we want manual stat input here
type Npc struct {
	Id string `json:"id"`
}

// TODO also could have the grapher settings here? or another root
type GlobalSettings struct {
	Npc                Npc  `json:"npc"`
	TeamSize           int  `json:"teamSize"`
	RaidLevel          int  `json:"raidLevel"`
	PathLevel          int  `json:"pathLevel"`
	OverlyDraining     bool `json:"overlyDraining"`
	IsCoxChallengeMode bool `json:"isCoxChallengeMode"`
}

// similar to npc, could have manual inputs in future
type GearItem struct {
	Id int `json:"id"`
}

type GearSetup struct {
	Name          string                `json:"setupName"`
	AttackStyle   string                `json:"attackStyle"`
	Gear          map[GearSlot]GearItem `json:"gear"`
	BlowpipeDarts GearItem              `json:"blowpipeDarts"`
}

type CombatStats struct {
	Attack    int `json:"attack"`
	Strength  int `json:"strength"`
	Ranged    int `json:"ranged"`
	Magic     int `json:"magic"`
	Hitpoints int `json:"hitpoints"`
}

// TODO other fields
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
