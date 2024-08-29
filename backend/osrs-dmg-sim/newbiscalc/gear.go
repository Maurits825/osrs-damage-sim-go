package newbiscalc

const (
	slayerHelm    = 25912
	salveAmuletEI = 12018
)

const (
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
)

const (
	tbow           = 20997
	blowpipe       = 12926
	dragonDarts    = 11230
	zaryteCrossbow = 26374
	bowfa          = 25865

	dragonArrows  = 11212
	rubyDBolts    = 21944
	diamondDBolts = 21946
)

const (
	shadowStaff   = 27275
	sangStaff     = 22323
	harmStaff     = 24423
	volatileStaff = 24424
)

// TODO hardcoded weapons, better way?
// TODO add more weapons, tentwhip, inq mace ...
var meleeWeapons = []int{scythe, fang, rapier, saladBlade}
var meleeSpecWeapons = []int{fang, bandosGodsword, armadylGodsword, abbysalDagger, crystalHalberd, voidwaker, dragonClaws, dragonWarhammer}

var rangedWeapons = []int{tbow, blowpipe, zaryteCrossbow, bowfa}
var rangedAmmo = []int{dragonArrows, rubyDBolts, diamondDBolts}
var rangedSpecWeapons = []int{blowpipe, zaryteCrossbow}

var magicWeapons = []int{shadowStaff, sangStaff, harmStaff}
var magicSpecWeapons = []int{volatileStaff}

var weapons = map[AttackStyle][]int{
	Melee:  meleeWeapons,
	Ranged: rangedWeapons,
	Magic:  magicWeapons,
}

var specWeapons = map[AttackStyle][]int{
	Melee:  meleeSpecWeapons,
	Ranged: rangedSpecWeapons,
	Magic:  magicSpecWeapons,
}
