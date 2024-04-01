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
	ThickSkinPrayer           Prayer = "thick_skin"
	BurstOfStrengthPrayer     Prayer = "burst_of_strength"
	ClarityOfThoughtPrayer    Prayer = "clarity_of_thought"
	SharpEyePrayer            Prayer = "sharp_eye"
	MysticWillPrayer          Prayer = "mystic_will"
	RockSkinPrayer            Prayer = "rock_skin"
	SuperhumanStrengthPrayer  Prayer = "superhuman_strength"
	ImprovedReflexesPrayer    Prayer = "improved_reflexes"
	RapidHealPrayer           Prayer = "rapid_heal"
	RapidRestorePrayer        Prayer = "rapid_restore"
	ProtectItemPrayer         Prayer = "protect_item"
	HawkEyePrayer             Prayer = "hawk_eye"
	MysticLorePrayer          Prayer = "mystic_lore"
	SteelSkinPrayer           Prayer = "steel_skin"
	UltimateStrengthPrayer    Prayer = "ultimate_strength"
	IncredibleReflexesPrayer  Prayer = "incredible_reflexes"
	ProtectFromMagicPrayer    Prayer = "protect_from_magic"
	ProtectFromMissilesPrayer Prayer = "protect_from_missiles"
	ProtectFromMeleePrayer    Prayer = "protect_from_melee"
	EagleEyePrayer            Prayer = "eagle_eye"
	MysticMightPrayer         Prayer = "mystic_might"
	RetributionPrayer         Prayer = "retribution"
	RedemptionPrayer          Prayer = "redemption"
	SmitePrayer               Prayer = "smite"
	PreservePrayer            Prayer = "preserve"
	ChivalryPrayer            Prayer = "chivalry"
	PietyPrayer               Prayer = "piety"
	RigourPrayer              Prayer = "rigour"
	AuguryPrayer              Prayer = "augury"
)

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
	Arclight        StatDrainWeapon = "Arclight"
	BandosGodsword  StatDrainWeapon = "Bandos godsword"
	AccursedSceptre StatDrainWeapon = "Accursed sceptre"
)

type StatDrain struct {
	Name  StatDrainWeapon `json:"name"`
	Value int             `json:"value"`
}

type PotionBoost string

const (
	AttackBoost              PotionBoost = "attack"
	SuperAttackBoost         PotionBoost = "super_attack"
	DivineSuperAttackBoost   PotionBoost = "divine_super_attack"
	StrengthBoost            PotionBoost = "strength"
	SuperStrengthBoost       PotionBoost = "super_strength"
	DivineSuperStrengthBoost PotionBoost = "divine_super_strength"
	CombatBoost              PotionBoost = "combat"
	SuperCombatBoost         PotionBoost = "super_combat"
	DivineSuperCombatBoost   PotionBoost = "divine_super_combat"
	ZamorakBrew              PotionBoost = "zamorak_brew"
	OverloadPlus             PotionBoost = "overload_plus"
	SmellingSalts            PotionBoost = "smelling_salts"
	MagicBoost               PotionBoost = "magic"
	DivineMagicBoost         PotionBoost = "divine_magic"
	AncientBrew              PotionBoost = "ancient_brew"
	ForgottenBrew            PotionBoost = "forgotten_brew"
	ImbuedHeart              PotionBoost = "imbued_heart"
	SaturatedHeart           PotionBoost = "saturated_heart"
	RangingBoost             PotionBoost = "ranging"
	DivineRangingBoost       PotionBoost = "divine_ranging"
	LiquidAdrenaline         PotionBoost = "liquid_adrenaline"
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
	GlobalSettings   GlobalSettings   `json:"globalSettings"`
	InputGearSetups  []InputGearSetup `json:"inputGearSetups"`
	EnableDebugTrack bool             `json:"enableDebugTrack"`
}
