package newbiscalc

import (
	"errors"

	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/dpscalc"
)

type gearSetupOptions map[dpscalc.GearSlot][]int
type gearSetup map[dpscalc.GearSlot]dpscalc.GearItem

// TODO simple func to get bis without budget consideration for now, from the bis graph
func getBisGearSetupOptions(graph SlotBisGraph) gearSetupOptions {
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
