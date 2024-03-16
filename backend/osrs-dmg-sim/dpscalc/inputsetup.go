package dpscalc

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

type CoxScaling struct {
	PartyMaxCombatLevel int  `json:"partyMaxCombatLevel"`
	PartyAvgMiningLevel int  `json:"partyAvgMiningLevel"`
	PartyMaxHpLevel     int  `json:"partyMaxHpLevel"`
	IsChallengeMode     bool `json:"isChallengeMode"`
}

// TODO also could have the grapher settings here? or another root
type GlobalSettings struct {
	Npc            Npc        `json:"npc"`
	TeamSize       int        `json:"teamSize"`
	RaidLevel      int        `json:"raidLevel"`
	PathLevel      int        `json:"pathLevel"`
	OverlyDraining bool       `json:"overlyDraining"`
	CoxScaling     CoxScaling `json:"coxScaling"`
}

// similar to npc, could have manual inputs in future
type GearItem struct {
	Id int `json:"id"`
}

type Prayer string

const (
	Piety Prayer = "piety"
)

// TODO spell
type GearSetup struct {
	Name            string                `json:"setupName"`
	AttackStyle     string                `json:"attackStyle"`
	Gear            map[GearSlot]GearItem `json:"gear"`
	BlowpipeDarts   GearItem              `json:"blowpipeDarts"`
	CurrentHp       int                   `json:"currentHp"`
	IsInWilderness  bool                  `json:"isInWilderness"`
	IsKandarinDiary bool                  `json:"isKandarinDiary"`
	IsOnSlayerTask  bool                  `json:"isOnSlayerTask"`
	IsSpecialAttack bool                  `json:"isSpecial"`
	MiningLevel     int                   `json:"miningLvl"`
	Prayers         []Prayer              `json:"prayers"`
	Spell           string                `json:"spell"`
}

type CombatStats struct {
	Attack    int `json:"attack"`
	Strength  int `json:"strength"`
	Ranged    int `json:"ranged"`
	Magic     int `json:"magic"`
	Hitpoints int `json:"hitpoints"`
	Defence   int `json:"defence"`
}

type StatDrainWeapon string

// TODO others
const (
	DragonWarhammer StatDrainWeapon = "Dragon warhammer"
)

type StatDrain struct {
	Name  StatDrainWeapon `json:"name"`
	Value int             `json:"value"`
}

type PotionBoost string

// TODO other pots
const (
	SuperCombat PotionBoost = "super_combat"
)

type GearSetupSettings struct {
	CombatStats  CombatStats   `json:"combatStats"`
	AttackCycle  int           `json:"attackCycle"`
	PotionBoosts []PotionBoost `json:"boosts"`
	StatDrain    []StatDrain   `json:"statDrains"`
}

type InputGearSetup struct {
	GearSetupSettings GearSetupSettings `json:"gearSetupSettings"`
	GearSetup         GearSetup         `json:"gearSetup"`
}

type InputSetup struct {
	GlobalSettings  GlobalSettings   `json:"globalSettings"`
	InputGearSetups []InputGearSetup `json:"inputGearSetups"`
}
