package biscalc

import (
	"cmp"
	"embed"
	"encoding/json"
	"fmt"
	"slices"

	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/dpscalc"
	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/wikidata"
)

//go:embed *.json
var jsonDataEmbed embed.FS

type ItemId struct {
	Id int `json:"id"`
}

var specData map[string]int

func init() {
	specData = wikidata.GetWikiData(wikidata.SpecProvider).(map[string]int)
}

func RunGearJsonBis(bisCalcSetup *BisCalcInputSetup) BisCalcResults {
	itemIds := loadJson()
	options := getGearSetupOptions(itemIds)
	bisResults := RunBisDpsCalc(bisCalcSetup, options)
	return bisResults
}

func loadJson() []ItemId {
	byteValue, err := jsonDataEmbed.ReadFile("container_bank.json")
	if err != nil {
		fmt.Println(err)
		return nil
	}

	var itemIds []ItemId
	if err := json.Unmarshal(byteValue, &itemIds); err != nil {
		fmt.Println("Error decoding item JSON:", err)
		return nil
	}

	return itemIds
}

func getGearSetupOptions(itemIds []ItemId) map[AttackStyle]gearSetupOptions {
	var meleeGear gearOptions = make(gearOptions)
	var rangedGear gearOptions = make(gearOptions)
	var magicGear gearOptions = make(gearOptions)
	meleeOptions := &gearSetupOptions{
		gearOptions: meleeGear,
		weapons:     make([]int, 0),
		specWeapons: make([]int, 0),
	}
	rangedOptions := &gearSetupOptions{
		gearOptions: rangedGear,
		weapons:     make([]int, 0),
		specWeapons: make([]int, 0),
	}
	magicOptions := &gearSetupOptions{
		gearOptions: magicGear,
		weapons:     make([]int, 0),
		specWeapons: make([]int, 0),
	}

	for _, itemId := range itemIds {
		item, ok := allItems[itemId.Id]
		if !ok || !item.Equipable || isFilter(item) {
			continue
		}

		gearSlot := dpscalc.GearSlot(item.Slot)

		if item.WeaponCategory == "" {
			meleeGear[gearSlot] = append(meleeGear[gearSlot], itemId.Id)
			rangedGear[gearSlot] = append(rangedGear[gearSlot], itemId.Id)
			magicGear[gearSlot] = append(magicGear[gearSlot], itemId.Id)
		} else {
			weaponStyles := dpscalc.WeaponStyles[item.WeaponCategory]
			style := weaponStyles[len(weaponStyles)-1].StyleType //kinda hacky but to get magic if autocast
			options := meleeOptions
			if style == dpscalc.Ranged {
				options = rangedOptions
			} else if style == dpscalc.Magic {
				options = magicOptions
			}
			if _, ok := specData[item.Name]; ok {
				options.specWeapons = append(options.specWeapons, itemId.Id)
			}
			options.weapons = append(options.weapons, itemId.Id)
		}
	}

	count := 2
	for _, gearSlot := range allGearSlots {
		meleeGear[gearSlot] = sortAndTakeTop(meleeGear[gearSlot], Melee, count)
		rangedGear[gearSlot] = sortAndTakeTop(rangedGear[gearSlot], Ranged, count)
		magicGear[gearSlot] = sortAndTakeTop(magicGear[gearSlot], Magic, count)
	}

	count = 5
	meleeOptions.weapons = sortAndTakeTop(meleeOptions.weapons, Melee, count)
	rangedOptions.weapons = sortAndTakeTop(rangedOptions.weapons, Ranged, count)
	magicOptions.weapons = sortAndTakeTop(magicOptions.weapons, Magic, count)

	return map[AttackStyle]gearSetupOptions{
		Melee:  *meleeOptions,
		Ranged: *rangedOptions,
		Magic:  *magicOptions,
	}
}

func isFilter(item wikidata.ItemData) bool {
	if item.ACrush == 0 &&
		item.AStab == 0 &&
		item.ASlash == 0 &&
		item.ARanged == 0 &&
		item.AMagic == 0 &&
		item.MeleeStrength == 0 &&
		item.RangedStrength == 0 &&
		item.MagicStrength == 0 {
		return true
	}

	if item.MeleeStrength < 0 ||
		item.RangedStrength < 0 ||
		item.MagicStrength < 0 {
		return true
	}

	return false
}

func sortAndTakeTop(ids []int, style AttackStyle, count int) []int {
	sortFn := sortByAttackStyle(style)
	slices.SortFunc(ids, sortFn)
	return ids[:min(count, len(ids))]
}

func sortStat(v1, v2 int) (bool, int) {
	if v1 != v2 {
		return true, cmp.Compare(v2, v1)
	}
	return false, 0
}

// TODO maybe sort by attack also? have to see if npc is weak maybe
func sortByAttackStyle(style AttackStyle) func(id1, id2 int) int {
	var getStats []func(item wikidata.ItemData) int

	switch style {
	case Melee:
		getStats = []func(item wikidata.ItemData) int{
			func(i wikidata.ItemData) int {
				return i.MeleeStrength
			},
			func(i wikidata.ItemData) int {
				return i.AttackSpeed
			},
			func(i wikidata.ItemData) int {
				return i.ASlash //TODO for now
			},
		}
	case Ranged: //TODO crossbows are basically always sorted last because no rstr
		getStats = []func(item wikidata.ItemData) int{
			func(i wikidata.ItemData) int {
				return i.RangedStrength
			},
			func(i wikidata.ItemData) int {
				return i.AttackSpeed
			},
			func(i wikidata.ItemData) int {
				return i.ARanged
			},
		}
	case Magic:
		getStats = []func(item wikidata.ItemData) int{
			func(i wikidata.ItemData) int {
				return int(i.MagicStrength) //TODO
			},
			func(i wikidata.ItemData) int {
				return i.AttackSpeed
			},
			func(i wikidata.ItemData) int {
				return i.AMagic
			},
		}
	}

	return func(id1, id2 int) int {
		item1 := allItems[id1]
		item2 := allItems[id2]
		for _, getStat := range getStats {
			if ok, r := sortStat(getStat(item1), getStat(item2)); ok {
				return r
			}
		}
		return 0
	}
}
