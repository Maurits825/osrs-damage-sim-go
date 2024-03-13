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

	e.name = item.Name

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
