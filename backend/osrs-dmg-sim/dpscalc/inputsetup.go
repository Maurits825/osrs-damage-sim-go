package dpscalc

import (
	"errors"
	"fmt"
)

const (
	MinTeamSize       = 1
	MaxTeamSize       = 100
	MinRaidLevel      = 0
	MaxRaidLevel      = 600
	MinPathLevel      = 0
	MaxPathLevel      = 4
	MinStatLevel      = 1
	MaxStatLevel      = 99
	MaxStatDrainCount = 5
	MaxStatDrainValue = 1000
)

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
type NpcInfo struct {
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
	Npc            NpcInfo    `json:"npc"`
	NpcHitpoints   int        `json:"npcHitpoints"`
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
	Name             string                `json:"setupName"`
	AttackStyle      string                `json:"attackStyle"`
	Gear             map[GearSlot]GearItem `json:"gear"`
	BlowpipeDarts    GearItem              `json:"blowpipeDarts"`
	CurrentHp        int                   `json:"currentHp"`
	IsInWilderness   bool                  `json:"isInWilderness"`
	IsKandarinDiary  bool                  `json:"isKandarinDiary"`
	IsMarkOfDarkness bool                  `json:"isMarkOfDarkness"`
	IsOnSlayerTask   bool                  `json:"isOnSlayerTask"`
	IsSpecialAttack  bool                  `json:"isSpecial"`
	MiningLevel      int                   `json:"miningLvl"`
	Prayers          []Prayer              `json:"prayers"`
	Spell            string                `json:"spell"`
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
	DragonWarhammer   StatDrainWeapon = "Dragon warhammer"
	ElderMaul         StatDrainWeapon = "Elder maul"
	Arclight          StatDrainWeapon = "Arclight"
	Emberlight        StatDrainWeapon = "Emberlight"
	BandosGodsword    StatDrainWeapon = "Bandos godsword"
	AccursedSceptre   StatDrainWeapon = "Accursed sceptre"
	BoneDagger        StatDrainWeapon = "Bone dagger"
	BarrelChestAnchor StatDrainWeapon = "Barrelchest anchor"
	Ralos             StatDrainWeapon = "Ralos"
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
	CombatStats          CombatStats          `json:"combatStats"`
	AttackCycle          int                  `json:"attackCycle"`
	PotionBoosts         []PotionBoost        `json:"boosts"`
	StatDrain            []StatDrain          `json:"statDrains"`
	RagingEchoesSettings RagingEchoesSettings `json:"ragingEchoesSettings"`
}

type RagingEchoesSettings struct {
	CombatMasteries CombatMasteries `json:"combatMasteries"`
}

type CombatMasteries struct {
	MeleeTier int `json:"meleeTier"`
	RangeTier int `json:"rangeTier"`
	MageTier  int `json:"mageTier"`
}

type InputGearSetup struct {
	GearSetupSettings GearSetupSettings `json:"gearSetupSettings"`
	GearSetup         GearSetup         `json:"gearSetup"`
}

type InputSetup struct {
	GlobalSettings   GlobalSettings   `json:"globalSettings"`
	InputGearSetups  []InputGearSetup `json:"inputGearSetups"`
	EnableDebugTrack bool             `json:"enableDebugTrack"`
	MultiNpcs        []NpcInfo        `json:"multiNpcs"`
}

func (inputSetup *InputSetup) Validate() error {
	multiNpcErr := isValidRange(len(inputSetup.MultiNpcs), 2, 20, "Multi npcs count")
	npcErr := inputSetup.GlobalSettings.Npc.Id == "0" || len(inputSetup.GlobalSettings.Npc.Id) == 0
	if multiNpcErr != nil && npcErr {
		return errors.New("no npc selected")
	}

	if err := inputSetup.GlobalSettings.Validate(); err != nil {
		return err
	}

	if len(inputSetup.InputGearSetups) == 0 {
		return errors.New("no input gear setups")
	}

	for _, inputGearSetup := range inputSetup.InputGearSetups {
		if err := inputGearSetup.validate(); err != nil {
			return err
		}
	}

	return nil
}

func (globalSettings *GlobalSettings) Validate() error {
	return runValidators(globalSettings, globalSettingsValidators)
}

func (gearSetupSettings *GearSetupSettings) Validate() error {
	return runValidators(gearSetupSettings, gearSetupSettingsValidators)
}

func (gearSetup *GearSetup) Validate() error {
	return runValidators(gearSetup, gearSetupValidators)
}

func (inputGearSetup *InputGearSetup) validate() error {
	if err := inputGearSetup.GearSetupSettings.Validate(); err != nil {
		return err
	}
	if err := inputGearSetup.GearSetup.Validate(); err != nil {
		return err
	}
	return nil
}

var globalSettingsValidators = []func(gs *GlobalSettings) error{
	func(gs *GlobalSettings) error {
		return isValidRange(gs.TeamSize, MinTeamSize, MaxTeamSize, "Team size")
	},
	func(gs *GlobalSettings) error {
		return isValidRange(gs.RaidLevel, MinRaidLevel, MaxRaidLevel, "Raid Level")
	},
	func(gs *GlobalSettings) error {
		return isValidRange(gs.PathLevel, MinPathLevel, MaxPathLevel, "Path level")
	},
}

var gearSetupSettingsValidators = []func(settings *GearSetupSettings) error{
	func(s *GearSetupSettings) error {
		return isCombatStatsValid(s.CombatStats)
	},
	func(s *GearSetupSettings) error {
		return isValidRange(s.AttackCycle, 0, 100, "Attack cycle")
	},
	func(s *GearSetupSettings) error {
		if err := isValidRange(len(s.StatDrain), 0, MaxStatDrainCount, "Stat drain count"); err != nil {
			return err
		}
		for _, statDrain := range s.StatDrain { //TODO maybe check only on hits stat drain type
			if err := isValidRange(statDrain.Value, 0, MaxStatDrainValue, "Stat drain value"); err != nil {
				return err
			}
		}
		return nil
	},
}

func isCombatStatsValid(combatStats CombatStats) error {
	isLevelValid := func(stat string, level int) error {
		return isValidRange(level, MinStatLevel, MaxStatLevel, stat)
	}

	if err := isLevelValid("Attack", combatStats.Attack); err != nil {
		return err
	}
	if err := isLevelValid("Strength", combatStats.Strength); err != nil {
		return err
	}
	if err := isLevelValid("Ranged", combatStats.Ranged); err != nil {
		return err
	}
	if err := isLevelValid("Magic", combatStats.Magic); err != nil {
		return err
	}
	if err := isLevelValid("Hitpoints", combatStats.Hitpoints); err != nil {
		return err
	}
	if err := isLevelValid("Defence", combatStats.Defence); err != nil {
		return err
	}

	return nil
}

var gearSetupValidators = []func(t *GearSetup) error{
	func(gs *GearSetup) error {
		if len(gs.Name) == 0 {
			return errors.New("empty gear setup name")
		}
		return nil
	},
	func(gs *GearSetup) error {
		if len(gs.AttackStyle) == 0 && len(gs.Spell) == 0 {
			return errors.New("empty attack style in (" + gs.Name + ") setup")
		}
		return nil
	},
	func(gs *GearSetup) error {
		return isValidRange(gs.CurrentHp, MinStatLevel, MaxStatLevel, "Current hp")
	},
	func(gs *GearSetup) error {
		return isValidRange(gs.MiningLevel, MinStatLevel, MaxStatLevel, "Mining level")
	},
}

func runValidators[T any](t T, validators []func(t T) error) error {
	for _, validator := range validators {
		if err := validator(t); err != nil {
			return err
		}
	}
	return nil
}

func isValidRange(value, min, max int, label string) error {
	if value < min || value > max {
		return fmt.Errorf("%s (%d) must be between %d and %d", label, value, min, max)
	}
	return nil
}
