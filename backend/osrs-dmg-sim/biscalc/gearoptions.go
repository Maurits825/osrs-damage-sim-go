package biscalc

import "github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/dpscalc"

const (
	infernal  = 21295
	torture   = 19553
	avernic   = 22322
	ferocious = 22981
	prims     = 13239

	scythe = 22325
	fang   = 26219

	ultor    = 28307
	bellator = 28316

	torvaHelm = 26382
	torvaBody = 26384
	torvaLegs = 26386

	inqHelm = 24419
	inqBody = 24420
	inqLegs = 24421
)

type weapon struct {
	gear         map[dpscalc.GearSlot]int
	attackStyles []string
}

type gearOptions map[dpscalc.GearSlot][]int

var meleeGearOptions = gearOptions{
	dpscalc.Head:   {torvaHelm, inqHelm},
	dpscalc.Cape:   {infernal},
	dpscalc.Neck:   {torture},
	dpscalc.Body:   {torvaBody, inqBody},
	dpscalc.Shield: {avernic},
	dpscalc.Legs:   {torvaLegs, inqLegs},
	dpscalc.Hands:  {ferocious},
	dpscalc.Feet:   {prims},
	dpscalc.Ring:   {ultor, bellator},
}

var meleeWeapons = []weapon{
	{
		gear: map[dpscalc.GearSlot]int{
			dpscalc.Weapon: scythe,
			dpscalc.Shield: -1,
		},
		attackStyles: []string{"Reap (Slash/Accurate)", "Chop (Slash/Aggressive)", "Jab (Crush/Aggressive)"},
	},
	{
		gear: map[dpscalc.GearSlot]int{
			dpscalc.Weapon: fang,
		},
		attackStyles: []string{"Stab (Stab/Accurate)", "Lunge (Stab/Aggressive)", "Slash (Slash/Aggressive)"},
	},
}
