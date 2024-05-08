package wikidata

import (
	"embed"
	"encoding/json"
	"fmt"
)

type ItemData struct {
	Name           string `json:"name"`
	AttackSpeed    int    `json:"aspeed"`
	AStab          int    `json:"astab"`
	ASlash         int    `json:"aslash"`
	ACrush         int    `json:"acrush"`
	AMagic         int    `json:"amagic"`
	ARanged        int    `json:"arange"`
	DStab          int    `json:"dstab"`
	DSlash         int    `json:"dslash"`
	DCrush         int    `json:"dcrush"`
	DMagic         int    `json:"dmagic"`
	DRanged        int    `json:"drange"`
	MeleeStrength  int    `json:"str"`
	RangedStrength int    `json:"rstr"`
	MagicStrength  int    `json:"mdmg"`
	Prayer         int    `json:"prayer"`
	Is2h           bool   `json:"is2h"`
	WeaponCategory string `json:"weaponCategory"`
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

	DStab   int `json:"dstab"`
	DSlash  int `json:"dslash"`
	DSCrush int `json:"dcrush"`
	DMagic  int `json:"dmagic"`
	DRange  int `json:"drange"`

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

//go:embed json-data/*
var jsonDataEmbed embed.FS

func GetItemData() map[int]ItemData {
	byteValue, err := jsonDataEmbed.ReadFile("json-data/items-dmg-sim.json")
	if err != nil {
		fmt.Println(err)
		return nil
	}

	var items map[int]ItemData
	if err := json.Unmarshal(byteValue, &items); err != nil {
		fmt.Println("Error decoding item JSON:", err)
		return nil
	}

	return items
}

func GetNpcData() map[string]NpcData {
	byteValue, err := jsonDataEmbed.ReadFile("json-data/npcs-dmg-sim.json")
	if err != nil {
		fmt.Println(err)
		return nil
	}

	var npcs map[string]NpcData
	if err := json.Unmarshal(byteValue, &npcs); err != nil {
		fmt.Println("Error decoding npc JSON:", err)
		return nil
	}

	return npcs
}
