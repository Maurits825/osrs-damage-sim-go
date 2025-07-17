package simpledmgsim

import (
	"math"

	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/dpscalc"
)

type detailedRun struct {
	Ttk      int        `json:"ttk"`
	TickData []tickData `json:"tickData"`
}

type tickData struct {
	Tick        int `json:"tick"`
	PresetIndex int `json:"presetIndex"`

	MaxHit   int     `json:"maxHit"`
	Accuracy float32 `json:"accuracy"`
	Damage   int     `json:"damage"`

	NpcHp  int `json:"npcHp"`
	NpcDef int `json:"npcDef"`

	SpecialAttack int `json:"specialAttack"`
}

type detailedRunLogger struct {
	minRun detailedRun
	maxRun detailedRun

	tickData      []tickData
	tickDataIndex int
}

// todo sizes and should check and stuff later
func newDetailedRunLogger() *detailedRunLogger {
	return &detailedRunLogger{
		minRun:        detailedRun{Ttk: math.MaxInt},
		maxRun:        detailedRun{},
		tickData:      make([]tickData, 200),
		tickDataIndex: 0,
	}
}

func (l *detailedRunLogger) logData(tick, damage int, currentGear *simGearSetup, dist []float32, npc *dpscalc.Npc, simPlayer simPlayer) {
	t := &l.tickData[l.tickDataIndex]
	t.Tick = tick
	t.PresetIndex = currentGear.gearPresetIndex
	t.MaxHit = len(dist) - 1
	t.Accuracy = 1 - dist[0]
	t.Damage = damage

	t.NpcHp = npc.CombatStats.Hitpoints
	t.NpcDef = npc.CombatStats.Defence

	t.SpecialAttack = simPlayer.specialAttack

	l.tickDataIndex++
}

func (l *detailedRunLogger) logKill(ttk int) {
	var r *detailedRun
	if ttk < l.minRun.Ttk {
		r = &l.minRun
	} else if ttk > l.maxRun.Ttk {
		r = &l.maxRun
	}

	if r != nil {
		r.Ttk = ttk
		//TODO we can make the mem perf better -> check benchmark
		r.TickData = make([]tickData, l.tickDataIndex)
		copy(r.TickData, l.tickData[0:l.tickDataIndex])
	}

	l.tickDataIndex = 0
}
