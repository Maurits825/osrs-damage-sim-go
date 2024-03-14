// TODO should this be its own package in wiki data?
// then have to think where to define equipmentItems
// in wikidata or damagesim?
package damagesim

import (
	"encoding/json"
	"fmt"
	"io"
	"os"
)

type equipmentItems map[string]equipmentItem

func (e *equipmentItem) UnmarshalJSON(data []byte) error {
	type itemFlat struct {
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
		//TODO weapon category enum?
	}

	var item itemFlat
	if err := json.Unmarshal(data, &item); err != nil {
		return err
	}

	e.equipmentStats.offensiveStats.stab = item.AStab
	e.equipmentStats.offensiveStats.slash = item.ASlash
	e.equipmentStats.offensiveStats.crush = item.ACrush
	e.equipmentStats.offensiveStats.magic = item.AMagic
	e.equipmentStats.offensiveStats.ranged = item.ARanged
	e.equipmentStats.offensiveStats.prayer = item.Prayer

	e.equipmentStats.defensiveStats.stab = item.DStab
	e.equipmentStats.defensiveStats.slash = item.DSlash
	e.equipmentStats.defensiveStats.crush = item.DCrush
	e.equipmentStats.defensiveStats.magic = item.DMagic
	e.equipmentStats.defensiveStats.ranged = item.DRanged

	e.equipmentStats.damageStats.meleeStrength = item.MeleeStrength
	e.equipmentStats.damageStats.rangedStrength = item.RangedStrength
	e.equipmentStats.damageStats.magicStrength = item.MagicStrength

	e.equipmentStats.attackSpeed = item.AttackSpeed

	e.name = item.Name

	return nil
}

func (n *npc) UnmarshalJSON(data []byte) error {
	type npcFlat struct {
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

	var flat npcFlat
	if err := json.Unmarshal(data, &flat); err != nil {
		return err
	}

	n.name = flat.Name
	n.respawn = flat.Respawn
	n.size = flat.Size
	n.isKalphite = flat.IsKalphite
	n.isDemon = flat.IsDemon
	n.isDragon = flat.IsDragon
	n.isUndead = flat.IsUndead
	n.isLeafy = flat.IsLeafy
	n.isXerician = flat.IsXerician
	n.isShade = flat.IsShade
	n.isTobEntryMode = flat.IsTobEntryMode
	n.isTobNormalMode = flat.IsTobNormalMode
	n.isTobHardMode = flat.IsTobHardMode

	n.combatStats = CombatStats{
		Attack:    flat.Attack,
		Strength:  flat.Strength,
		Ranged:    flat.Ranged,
		Magic:     flat.Magic,
		Hitpoints: flat.Hitpoints,
		Defence:   flat.Defence,
	}

	n.baseCombatStats = n.combatStats

	n.aggressiveStats = aggressiveStats{
		attack: flat.AAttack,
		magic:  flat.AMagic,
		ranged: flat.ARange,
	}

	n.damageStats = damageStats{
		meleeStrength:  flat.MeleeStrength,
		rangedStrength: flat.RangedStrength,
		magicStrength:  flat.MagicStrength,
	}

	n.defensiveStats = defensiveStats{
		stab:   flat.DStab,
		slash:  flat.DSlash,
		crush:  flat.DSCrush,
		magic:  flat.DMagic,
		ranged: flat.DRange,
	}

	return nil
}

func loadItemWikiData() equipmentItems {
	itemJson, err := os.Open("damagesim/wiki-data/items-dmg-sim.json")

	if err != nil {
		fmt.Println(err)
		return nil
	}

	defer itemJson.Close()

	byteValue, _ := io.ReadAll(itemJson)
	var items equipmentItems
	if err := json.Unmarshal(byteValue, &items); err != nil {
		fmt.Println("Error decoding item JSON:", err)
		return nil
	}

	fmt.Println("Loaded wiki items!")
	return items
}

type npcs map[string]npc

func loadNpcWikiData() npcs {
	npcJson, err := os.Open("damagesim/wiki-data/npcs-dmg-sim.json")

	if err != nil {
		fmt.Println(err)
		return nil
	}

	defer npcJson.Close()

	byteValue, _ := io.ReadAll(npcJson)
	var npcs npcs
	if err := json.Unmarshal(byteValue, &npcs); err != nil {
		fmt.Println("Error decoding npc JSON:", err)
		return nil
	}

	fmt.Println("Loaded wiki npcs!")
	return npcs
}
