package simpledmgsim

import "github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/dpscalc"

type hitDistCache struct {
	cache   []map[uint64][]float32
	hashers []npcHasher

	globalSettings    *dpscalc.GlobalSettings
	gearSetupSettings *dpscalc.GearSetupSettings
	gearPresets       []dpscalc.GearSetup

	inputGearSetup *dpscalc.InputGearSetup
}

type npcHasher func(npc dpscalc.Npc) uint64

func newHitDistCache(gs *dpscalc.GlobalSettings, settings *dpscalc.GearSetupSettings, presets []dpscalc.GearSetup) *hitDistCache {
	hdc := &hitDistCache{
		cache:             make([]map[uint64][]float32, len(presets)),
		hashers:           make([]npcHasher, len(presets)),
		globalSettings:    gs,
		gearSetupSettings: settings,
		gearPresets:       presets,
		inputGearSetup: &dpscalc.InputGearSetup{
			GearSetupSettings: *settings,
		},
	}

	for i := range presets {
		hdc.cache[i] = make(map[uint64][]float32)
		hdc.hashers[i] = hashNpc
		//todo this check for ruby is kinda scuffed but works for now
		if presets[i].Gear[dpscalc.Ammo].Id == 9242 || presets[i].Gear[dpscalc.Ammo].Id == 21944 {
			hdc.hashers[i] = hashNpcRuby
		}
	}

	return hdc
}

func (c *hitDistCache) calcHitDist(npc dpscalc.Npc, presetIndex int) []float32 {
	c.inputGearSetup.GearSetup = c.gearPresets[presetIndex]

	p := dpscalc.GetPlayer(c.globalSettings, c.inputGearSetup)
	p.Npc = npc
	hitDist := dpscalc.GetPlayerHitDist(p)

	//calc cumulative prob
	cumulativeProb := float32(0.0)
	for i, prob := range hitDist {
		cumulativeProb += prob
		hitDist[i] = cumulativeProb
	}

	return hitDist
}

//could we also just use getDefRoll as the hash?
func hashNpc(npc dpscalc.Npc) uint64 {
	h := uint64(0)
	h |= uint64(npc.CombatStats.Defence) << 32
	h |= uint64(npc.CombatStats.Magic)
	return h
}

func hashNpcRuby(npc dpscalc.Npc) uint64 {
	h := uint64(0)
	h |= uint64(npc.CombatStats.Defence) << 32
	h |= uint64(min(500, npc.CombatStats.Hitpoints))
	return h
}

func (c *hitDistCache) getHitDist(npc dpscalc.Npc, presetIndex int) []float32 {
	h := c.hashers[presetIndex](npc)
	dist, exists := c.cache[presetIndex][h]

	if !exists {
		dist = c.calcHitDist(npc, presetIndex)
		c.cache[presetIndex][h] = dist
	}

	return dist
}
