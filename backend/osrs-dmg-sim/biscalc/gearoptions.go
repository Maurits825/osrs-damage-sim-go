package biscalc

import "github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/dpscalc"

const (
	slayerHelm = 25912

	infernal  = 21295
	torture   = 19553
	avernic   = 22322
	ferocious = 22981
	prims     = 13239

	scythe     = 22325
	fang       = 26219
	rapier     = 22324
	saladBlade = 23995

	bandosGodsword  = 11804
	armadylGodsword = 11802
	abbysalDagger   = 13265
	dragonDagger    = 1215
	crystalHalberd  = 23987
	voidwaker       = 27690
	dragonClaws     = 13652
	dragonWarhammer = 13576

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

	tbow           = 20997
	blowpipe       = 12926
	dragonDarts    = 11230
	zaryteCrossbow = 26374
	bowfa          = 25865

	masoriHelm = 27235
	masoriBody = 27238
	masoriLegs = 27241

	crystalHelm = 23971
	crystalBody = 23975
	crystalLegs = 23979

	dragonArrows    = 11212
	rubyDragonBolts = 21944
)

const (
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

//TODO otherGear sets like void, always better to wear the set + other otherGear
//TODO also salve if undead? or always... but kinda of a waste when we get more and more items

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

var meleeWeapons = []int{scythe, fang, rapier, saladBlade}
var meleeSpecWeapons = []int{fang, bandosGodsword, armadylGodsword, abbysalDagger, crystalHalberd, voidwaker, dragonClaws, dragonWarhammer}

var rangedGearOptions = gearOptions{
	dpscalc.Head:   {masoriHelm, crystalHelm},
	dpscalc.Cape:   {blessedQuiver},
	dpscalc.Neck:   {anguish},
	dpscalc.Body:   {masoriBody, crystalBody},
	dpscalc.Shield: {twistedBuckler},
	dpscalc.Legs:   {masoriLegs, crystalLegs},
	dpscalc.Hands:  {zaryteVambs},
	dpscalc.Feet:   {pegs},
	dpscalc.Ring:   {venatorRing},
	dpscalc.Ammo:   {dragonArrows, rubyDragonBolts},
}

var rangedWeapons = []int{tbow, blowpipe, zaryteCrossbow, bowfa}
var rangedSpecWeapons = []int{blowpipe, zaryteCrossbow}

var magicGearOptions = gearOptions{
	dpscalc.Head:   {ancestralHat, virtusHat},
	dpscalc.Cape:   {mageArenaCape},
	dpscalc.Neck:   {occult},
	dpscalc.Body:   {ancestralBody, virtusBody},
	dpscalc.Shield: {elidinisWard, tomeOfFire},
	dpscalc.Legs:   {ancestralLegs, virtusLegs},
	dpscalc.Hands:  {tormented},
	dpscalc.Feet:   {eternal},
	dpscalc.Ring:   {magusRing},
}

var magicWeapons = []int{shadowStaff, sangStaff, harmStaff}
