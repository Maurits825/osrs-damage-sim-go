package biscalc

import "github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/dpscalc"

const (
	slayerHelm    = 25912
	salveAmuletEI = 12018
)

const (
	scythe        = 22325
	saladBlade    = 23995
	soulreaperAxe = 28338
	noxHally      = 29796

	fang       = 26219
	rapier     = 22324
	zammySpear = 11824

	inqMace         = 24417
	elderMaul       = 21003
	abbysalBludgeon = 13263

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
	crystalHelm = 23971
	crystalTop  = 23975
	crystalBot  = 23979
)

const (
	shadowStaff   = 27275
	sangStaff     = 22323
	harmStaff     = 24423
	volatileStaff = 24424

	tomeOfFire = 20714
)

const (
	meleeVoidHelm   = 11665
	mageVoidHelm    = 11663
	rangeVoidHelm   = 11664
	eliteVoidTop    = 13072
	eliteVoidBot    = 13073
	eliteVoidGloves = 8842
)

// TODO hardcoded weapons, better way?
var meleeStabWeapons = []int{fang, rapier, noxHally, zammySpear}
var meleeSlashWeapons = []int{scythe, saladBlade, soulreaperAxe, noxHally}
var meleeCrushWeapons = []int{scythe, inqMace, elderMaul, abbysalBludgeon}
var meleeSpecWeapons = []int{fang, bandosGodsword, armadylGodsword, abbysalDagger, crystalHalberd, voidwaker, dragonClaws, dragonWarhammer}

//TODO bowfa has to be with crystal armour, crystal armour is only good with bowfa
var rangedWeapons = []int{tbow, blowpipe, zaryteCrossbow, bowfa}
var rangedAmmo = []int{dragonArrows, rubyDBolts, diamondDBolts}
var rangedSpecWeapons = []int{blowpipe, zaryteCrossbow}

var magicWeapons = []int{shadowStaff, sangStaff, harmStaff}
var magicSpecWeapons = []int{volatileStaff}
var surgeSpells = []string{"Earth Surge", "Water Surge", "Fire Surge", "Air Surge"}

var weapons = map[dpscalc.CombatStyleType][]int{
	dpscalc.Stab:   meleeStabWeapons,
	dpscalc.Slash:  meleeSlashWeapons,
	dpscalc.Crush:  meleeCrushWeapons,
	dpscalc.Ranged: rangedWeapons,
	dpscalc.Magic:  magicWeapons,
}

var specWeapons = map[dpscalc.CombatStyleType][]int{
	dpscalc.Stab:   meleeSpecWeapons,
	dpscalc.Slash:  meleeSpecWeapons,
	dpscalc.Crush:  meleeSpecWeapons,
	dpscalc.Ranged: rangedSpecWeapons,
	dpscalc.Magic:  magicSpecWeapons,
}
