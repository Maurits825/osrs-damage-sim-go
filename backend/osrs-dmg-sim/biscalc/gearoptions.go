package biscalc

import "github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/dpscalc"

const (
	slayerHelm = 25912

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

const (
	anguish        = 19547
	blessedQuiver  = 28955
	zaryteVambs    = 26235
	venatorRing    = 28310
	pegs           = 13237
	twistedBuckler = 21000

	tbow            = 20997
	blowpipe        = 12926
	dragonDarts     = 11230
	zaryteCrossbow  = 26374
	rubyDragonBolts = 21944
	bowfa           = 25865

	masoriHelm = 27235
	masoriBody = 27238
	masoriLegs = 27241

	crystalHelm = 23971
	crystalBody = 23975
	crystalLegs = 23979
)

const ( //TODO
	occult        = 12002
	mageArenaCape = 21795
	tormented     = 19544
	magusRing     = 28313
	eternal       = 13235
	elidinisWard  = 27251

	shadowStaff = 27275
	sangStaff   = 22323
	harmStaff   = 24423
	tomeOfFire  = 20714

	ancestralHat  = 21018
	ancestralBody = 21021
	ancestralLegs = 21024

	virtusHat  = 26241
	virtusBody = 26243
	virtusLegs = 26245
)

//TODO gear sets like void, always better to wear the set + other gear

type weapon struct {
	gear         map[dpscalc.GearSlot]int
	attackStyles []string
	gearSetupMod func(gearSetup *dpscalc.GearSetup)
}

type gearOptions map[dpscalc.GearSlot][]int

var meleeGearOptions = gearOptions{
	dpscalc.Head:   {torvaHelm, inqHelm}, //slayerHelm
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

var rangedGearOptions = gearOptions{
	dpscalc.Head:   {masoriHelm, crystalHelm}, //TODO is bowfa full crystal being calced correct??
	dpscalc.Cape:   {blessedQuiver},
	dpscalc.Neck:   {anguish},
	dpscalc.Body:   {masoriBody, crystalBody},
	dpscalc.Shield: {twistedBuckler},
	dpscalc.Legs:   {masoriLegs, crystalLegs},
	dpscalc.Hands:  {zaryteVambs},
	dpscalc.Feet:   {pegs},
	dpscalc.Ring:   {venatorRing},
}

var rangedWeapons = []weapon{
	{
		gear: map[dpscalc.GearSlot]int{
			dpscalc.Weapon: tbow,
			dpscalc.Shield: -1,
			dpscalc.Ammo:   11212,
		},
		attackStyles: []string{"Accurate (Ranged/Accurate)", "Rapid (Ranged/Rapid)"},
	},
	{
		gear: map[dpscalc.GearSlot]int{
			dpscalc.Weapon: blowpipe,
			dpscalc.Shield: -1,
			dpscalc.Ammo:   -1,
		},
		attackStyles: []string{"Accurate (Ranged/Accurate)", "Rapid (Ranged/Rapid)"},
	},
	{
		gear: map[dpscalc.GearSlot]int{
			dpscalc.Weapon: zaryteCrossbow,
			dpscalc.Ammo:   rubyDragonBolts,
		},
		attackStyles: []string{"Accurate (Ranged/Accurate)", "Rapid (Ranged/Rapid)"},
	},
	{
		gear: map[dpscalc.GearSlot]int{
			dpscalc.Weapon: bowfa,
			dpscalc.Shield: -1,
			dpscalc.Ammo:   -1,
		},
		attackStyles: []string{"Accurate (Ranged/Accurate)", "Rapid (Ranged/Rapid)"},
	},
}

var magicGearOptions = gearOptions{
	dpscalc.Head:   {ancestralHat, virtusHat},
	dpscalc.Cape:   {mageArenaCape},
	dpscalc.Neck:   {occult},
	dpscalc.Body:   {ancestralBody, virtusBody},
	dpscalc.Shield: {elidinisWard},
	dpscalc.Legs:   {ancestralLegs, virtusLegs},
	dpscalc.Hands:  {tormented},
	dpscalc.Feet:   {eternal},
	dpscalc.Ring:   {magusRing},
}

var magicWeapons = []weapon{
	{
		gear: map[dpscalc.GearSlot]int{
			dpscalc.Weapon: shadowStaff,
			dpscalc.Shield: -1,
		},
		attackStyles: []string{"Accurate (Magic/Accurate)"},
	},
	{
		gear: map[dpscalc.GearSlot]int{
			dpscalc.Weapon: sangStaff,
		},
		attackStyles: []string{"Accurate (Magic/Accurate)"},
	},
	{
		gear: map[dpscalc.GearSlot]int{
			dpscalc.Weapon: harmStaff,
			dpscalc.Shield: tomeOfFire,
		},
		attackStyles: []string{"Spell (Magic/Autocast)"},
		gearSetupMod: func(gearSetup *dpscalc.GearSetup) {
			gearSetup.Spell = "Fire Surge"
		},
	},
}
