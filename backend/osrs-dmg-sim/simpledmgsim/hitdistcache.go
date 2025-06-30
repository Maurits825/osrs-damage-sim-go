package simpledmgsim

import "github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/dpscalc"

type hitDistCache struct {
	cache []map[uint64][]float32

	globalSettings    *dpscalc.GlobalSettings
	gearSetupSettings *dpscalc.GearSetupSettings
	gearPresets       []dpscalc.GearSetup

	inputGearSetup *dpscalc.InputGearSetup
}

func newHitDistCache(gs *dpscalc.GlobalSettings, settings *dpscalc.GearSetupSettings, presets []dpscalc.GearSetup) *hitDistCache {
	hdc := &hitDistCache{
		cache:             make([]map[uint64][]float32, len(presets)),
		globalSettings:    gs,
		gearSetupSettings: settings,
		gearPresets:       presets,
		inputGearSetup: &dpscalc.InputGearSetup{
			GearSetupSettings: *settings,
		},
	}

	for i := range hdc.cache {
		hdc.cache[i] = make(map[uint64][]float32)
	}

	return hdc
}

//TODO we have to figure out how/where stat drain
//do we use stat drain or set the def
//where do we stat drain/ how do we hash, stat drain list? thats scuffed
//otherwise what stats from the npc do we hash
//just defence and magic? can hash 2 16bit in 32bit int32 then?
//so as a hdc do we want npc stats or stat drain -> npc stats make more sense -> directly hash
//so users have to stat drain no the npc, but we cant pass the npc.... (Npc vs npc)!!!!
//so fix npc?
func (c *hitDistCache) calcHitDist(npc dpscalc.Npc, presetIndex int) []float32 {
	//TODO have one of this
	c.inputGearSetup.GearSetup = c.gearPresets[presetIndex]

	p := dpscalc.GetPlayer(c.globalSettings, c.inputGearSetup)
	p.Npc = npc //todo this actually works???
	hitDist := dpscalc.GetPlayerHitDist(p)

	return hitDist
}

//todo hashing stuff
func hashNpc(npc dpscalc.Npc) uint64 {
	h := uint64(0)
	h |= uint64(npc.CombatStats.Defence) << 32
	h |= uint64(npc.CombatStats.Magic)
	return h
}

func (c *hitDistCache) getHitDist(npc dpscalc.Npc, presetIndex int) []float32 {
	h := hashNpc(npc)
	dist, exists := c.cache[presetIndex][h]

	if !exists {
		dist = c.calcHitDist(npc, presetIndex)
		c.cache[presetIndex][h] = dist
	}

	return dist
}
