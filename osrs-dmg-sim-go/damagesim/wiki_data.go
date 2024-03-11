package damagesim

import (
	"encoding/json"
	"fmt"
	"io"
	"os"
)

type item struct {
	Name           string `json:"name"`
	AttackSpeed    int    `json:"aspeed"`
	Stab           int    `json:"astab"`
	Slash          int    `json:"aslash"`
	Crush          int    `json:"acrush"`
	Magic          int    `json:"amagic"`
	Ranged         int    `json:"arange"`
	MeleeStrength  int    `json:"str"`
	RangedStrength int    `json:"rstr"`
	MagicStrength  int    `json:"mdmg"`
	//TODO weapon category enum?
}

type items map[string]item

func loadItemWikiData() items {
	itemJson, err := os.Open("damagesim/wiki-data/items-dmg-sim.json")

	if err != nil {
		fmt.Println(err)
		return nil
	}

	defer itemJson.Close()

	byteValue, _ := io.ReadAll(itemJson)
	var items items
	if err := json.Unmarshal(byteValue, &items); err != nil {
		fmt.Println("Error decoding JSON:", err)
		return nil
	}

	fmt.Println("Loaded wiki items!")
	return items
}
