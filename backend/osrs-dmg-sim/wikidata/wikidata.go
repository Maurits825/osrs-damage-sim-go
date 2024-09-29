package wikidata

import (
	"embed"
	"encoding/json"
	"fmt"
)

type DataTypeProvider int

const (
	ItemProvider     DataTypeProvider = 1
	NpcProvider      DataTypeProvider = 2
	SpellProvider    DataTypeProvider = 3
	SpecProvider     DataTypeProvider = 4
	BisGraphProvider DataTypeProvider = 5
	IdAliasProvider  DataTypeProvider = 6
)

type ItemData struct {
	Name           string  `json:"name"`
	AttackSpeed    int     `json:"aspeed"`
	AStab          int     `json:"astab"`
	ASlash         int     `json:"aslash"`
	ACrush         int     `json:"acrush"`
	AMagic         int     `json:"amagic"`
	ARanged        int     `json:"arange"`
	DStab          int     `json:"dstab"`
	DSlash         int     `json:"dslash"`
	DCrush         int     `json:"dcrush"`
	DMagic         int     `json:"dmagic"`
	DRanged        int     `json:"drange"`
	MeleeStrength  int     `json:"str"`
	RangedStrength int     `json:"rstr"`
	MagicStrength  float32 `json:"mdmg"`
	Prayer         int     `json:"prayer"`
	Is2h           bool    `json:"is2h"`
	WeaponCategory string  `json:"weaponCategory"`
	Slot           int     `json:"slot"`
	Equipable      bool    `json:"equipable"`
}

type NpcData struct {
	Name      string `json:"name"`
	Hitpoints int    `json:"hitpoints"`
	Attack    int    `json:"att"`
	Strength  int    `json:"str"`
	Defence   int    `json:"def"`
	Magic     int    `json:"mage"`
	Ranged    int    `json:"range"`

	AAttack int `json:"attbns"`
	AMagic  int `json:"amagic"`
	ARange  int `json:"arange"`

	MeleeStrength  int `json:"strbns"`
	MagicStrength  int `json:"rngbns"`
	RangedStrength int `json:"mbns"`

	DStab                    int    `json:"dstab"`
	DSlash                   int    `json:"dslash"`
	DSCrush                  int    `json:"dcrush"`
	DMagic                   int    `json:"dmagic"`
	DRange                   int    `json:"drange"`
	DLight                   int    `json:"dlight"`
	DStandard                int    `json:"dstandard"`
	DHeavy                   int    `json:"dheavy"`
	ElementalWeaknessType    string `json:"elementalweaknesstype"`
	ElementalWeaknessPercent int    `json:"elementalweaknesspercent"`

	Size            int  `json:"size"`
	IsKalphite      bool `json:"isKalphite"`
	IsDemon         bool `json:"isDemon"`
	IsDragon        bool `json:"isDragon"`
	IsUndead        bool `json:"isUndead"`
	IsLeafy         bool `json:"isLeafy"`
	IsXerician      bool `json:"isXerician"`
	IsShade         bool `json:"isShade"`
	IsTobEntryMode  bool `json:"isTobEntryMode"`
	IsTobNormalMode bool `json:"isTobNormalMode"`
	IsTobHardMode   bool `json:"isTobHardMode"`
	Respawn         int  `json:"respawn"`
}

type SpellData struct {
	Name      string `json:"name"`
	Image     string `json:"image"`
	MaxHit    int    `json:"max_hit"`
	SpellBook string `json:"spellbook"`
	Element   string `json:"element"`
}

type BisSlotGraph struct {
	Nodes map[string]BisItem `json:"nodes"`
	Roots []string           `json:"roots"`
}

type BisItem struct {
	Ids  []string `json:"ids"`
	Next []string `json:"next"`
}

type BisGraphs map[string]map[string]BisSlotGraph

//go:embed json-data/*
var jsonDataEmbed embed.FS

func GetWikiData(p DataTypeProvider) any {
	var data any
	var err error

	switch p {
	case ItemProvider:
		data, err = getJsonData[map[int]ItemData]("json-data/items-dmg-sim.json")
	case NpcProvider:
		data, err = getJsonData[map[string]NpcData]("json-data/npcs-dmg-sim.json")
	case SpellProvider:
		data, err = getJsonData[[]SpellData]("json-data/spells.json")
	case SpecProvider:
		data, err = getJsonData[map[string]int]("json-data/special_attack.json")
	case BisGraphProvider:
		data, err = getJsonData[BisGraphs]("json-data/bis_graph.json")
	case IdAliasProvider:
		data, err = getJsonData[map[int]int]("json-data/id_aliases.json")
	}

	if err != nil {
		fmt.Println(err)
		return nil
	}
	return data
}

func getJsonData[T any](fileName string) (T, error) {
	var data T
	byteValue, err := jsonDataEmbed.ReadFile(fileName)

	if err != nil {
		return data, err
	}

	if err := json.Unmarshal(byteValue, &data); err != nil {
		return data, err
	}
	return data, err
}
