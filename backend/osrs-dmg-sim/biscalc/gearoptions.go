package biscalc

import (
	"errors"
	"strings"

	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/dpscalc"
)

var allGearSlots = []dpscalc.GearSlot{
	dpscalc.Head,
	dpscalc.Cape,
	dpscalc.Neck,
	dpscalc.Weapon,
	dpscalc.Body,
	dpscalc.Shield,
	dpscalc.Legs,
	dpscalc.Hands,
	dpscalc.Feet,
	dpscalc.Ring,
	dpscalc.Ammo,
}

type gearSetupOptions map[dpscalc.GearSlot][]int
type gearSetup map[dpscalc.GearSlot]dpscalc.GearItem

func (gear gearSetup) isValid() bool {
	weaponId := gear[dpscalc.Weapon].Id
	isAmmoEmpty := gear[dpscalc.Ammo].Id == dpscalc.EmptyItemId

	// TODO add more charged based ranged weapons
	if weaponId == blowpipe || weaponId == bowfa {
		if !isAmmoEmpty {
			return false
		}
	}

	//check 2h and shield
	is2h := allItems[weaponId].Is2h
	if is2h && gear[dpscalc.Shield].Id != dpscalc.EmptyItemId {
		return false
	}

	//invalidate one handed weapon with no shield
	//TODO for budget setups could allow this
	if !is2h && gear[dpscalc.Shield].Id == dpscalc.EmptyItemId {
		return false
	}

	//check ammo, TODO a bit scuffed
	ammoName := allItems[gear[dpscalc.Ammo].Id].Name
	switch allItems[weaponId].WeaponCategory {
	case "CROSSBOW":
		if !strings.Contains(ammoName, "bolts") {
			return false
		}
	case "BOW":
		if !strings.Contains(ammoName, "arrow") {
			return false
		}
	case "THROWN", "CHINCHOMPAS":
		if !isAmmoEmpty {
			return false
		}
	}

	//TODO other checks?
	return true
}

func (setup gearSetup) clone() gearSetup {
	newSetup := make(gearSetup)
	for _, slot := range allGearSlots {
		newSetup[slot] = setup[slot]
	}
	return newSetup
}

func (options gearSetupOptions) enrichGearSetupOptions(style dpscalc.CombatStyleType, setup *BisCalcInputSetup) {
	options.addGearId(dpscalc.Shield, dpscalc.EmptyItemId)
	options.addGearId(dpscalc.Ammo, dpscalc.EmptyItemId)

	if style == dpscalc.Ranged {
		options.addGearIds(dpscalc.Ammo, rangedAmmo)
	}

	//add weapons based on style
	if setup.IsSpecialAttack {
		options.addGearIds(dpscalc.Weapon, specWeapons[style])
	} else {
		options.addGearIds(dpscalc.Weapon, weapons[style])
	}

	if setup.IsOnSlayerTask {
		options.addGearId(dpscalc.Head, slayerHelm)
	}

	npc := dpscalc.GetNpc(setup.GlobalSettings.Npc.Id)
	if npc.IsUndead {
		options.addGearId(dpscalc.Neck, salveAmuletEI)
	}

	//TODO could also add dragon bane weapons if dragon
	//demon bane if demon and stuff
}

func (opt gearSetupOptions) addGearId(slot dpscalc.GearSlot, id int) {
	opt[slot] = append(opt[slot], id)
}

func (opt gearSetupOptions) addGearIds(slot dpscalc.GearSlot, ids []int) {
	opt[slot] = append(opt[slot], ids...)
}

// TODO simple func to get bis without budget consideration for now, from the bis graph
func getGearSetupOptions(graph SlotBisGraph) gearSetupOptions {
	options := make(gearSetupOptions)
	for _, slot := range allGearSlots {
		options[slot] = make([]int, len(graph[slot]))
		for i := range graph[slot] {
			options[slot][i] = graph[slot][i].ids[0] //take first item here
		}
	}
	return options
}

func gearSetupOptionsIterator(options gearSetupOptions) func() (gearSetup, error) {
	var currentGear gearSetup = make(gearSetup)
	iteratorEmpty := false

	var gearIndices map[dpscalc.GearSlot]int = make(map[dpscalc.GearSlot]int)
	var gearLengths map[dpscalc.GearSlot]int = make(map[dpscalc.GearSlot]int)
	for _, slot := range allGearSlots {
		ids, ok := options[slot]
		gearIndices[slot] = 0
		gearLengths[slot] = len(ids)
		if !ok {
			gearLengths[slot] = 1
		}
	}

	gearSlotIndex := len(allGearSlots) - 1
	lastGearSlotIndex := gearSlotIndex

	return func() (gearSetup, error) {
		if iteratorEmpty {
			return nil, errors.New("iterator empty")
		}

		//get current gear based on indices
		for _, slot := range allGearSlots {
			ids, ok := options[slot]
			if ok {
				id := ids[gearIndices[slot]]
				currentGear[slot] = dpscalc.GearItem{Id: id}
			}
		}

		//update indices
		gearIndices[allGearSlots[lastGearSlotIndex]] += 1
		gearSlotIndex = lastGearSlotIndex
		gearSlot := allGearSlots[gearSlotIndex]
		for gearIndices[gearSlot] == gearLengths[gearSlot] {
			//iterator is empty
			if gearSlotIndex == 0 {
				iteratorEmpty = true
				return currentGear, nil
			}

			gearIndices[gearSlot] = 0
			gearSlotIndex--
			gearSlot = allGearSlots[gearSlotIndex]
			gearIndices[gearSlot] += 1
		}

		return currentGear, nil
	}
}
