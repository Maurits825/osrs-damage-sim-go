package dpscalc

import (
	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/wikidata"
)

type equipmentItems map[int]equipmentItem

func getEquipmentItems(items map[int]wikidata.ItemData) equipmentItems {
	equipmentItems := make(equipmentItems)

	for id, item := range items {
		e := equipmentItem{}
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
		e.weaponStyle = item.WeaponCategory
		e.is2H = item.Is2h

		equipmentItems[id] = e
	}

	return equipmentItems
}
