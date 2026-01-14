package dpscalc

const (
	EmptyItemId = -1

	harmStaff            = 24423
	blowpipe             = 12926
	tumekenShadow        = 27275
	dinhsBulwark         = 21015
	meleeVoidHelm        = 11665
	mageVoidHelm         = 11663
	rangeVoidHelm        = 11664
	salveAmulet          = 4081
	salveAmuletE         = 10588
	salveAmuletI         = 12017
	salveAmuletEI        = 12018
	blackMask            = 8901
	blackMaskImbued      = 11774
	slayerHelm           = 11864
	slayerHelmImbued     = 11865
	arclight             = 19675
	dragonHunterLance    = 22978
	dragonHunterCrossbow = 21012
	kerisBreaching       = 25981
	soulreaperAxe        = 28338
	leafBladedAxe        = 20727
	colossalBlade        = 27021
	bowfa                = 25865
	crystalBow           = 23983
	crystalHelm          = 23971
	crystalLegs          = 23979
	crystalBody          = 23975
	twistedBow           = 20997

	tridentSeas      = 11905
	tridentSwamp     = 12899
	thammaronSceptre = 22552
	sangStaff        = 22323
	dawnbringer      = 22516
	warpedSceptre    = 28583
	dragonHunterWand = 30070

	brimstoneRing = 22975
	osmumtenFang  = 26219

	scythe = 22325

	dualMachiato = 28997

	tomeOfFire  = 20714
	tomeOfWater = 25574
	tomeOfEarth = 30064

	zaryteCrossbow = 26374

	bandosGodsword    = 11804
	armadylGodsword   = 11802
	saradominGodsword = 11806
	zamorakGodsword   = 11808
	ancientGodsword   = 26233

	abbysalDagger  = 13265
	dragonDagger   = 1215
	crystalHalberd = 23987
	voidwaker      = 27690

	volatileStaff = 24424

	webweaver       = 27652
	accursedSceptre = 27662
	ursineMace      = 27657

	darkbow      = 11235
	dragonArrows = 11212

	dragonClaws     = 13652
	burningClaws    = 29577
	dragonWarhammer = 13576

	boneDagger        = 8872
	barrelChestAnchor = 10887
	elderMaul         = 21003

	blessedQuiver = 28955

	inqMace = 24417

	scorchingBow = 29591
	emberlight   = 29589
	purgingStaff = 29594

	ralos = 28919

	kerisAmascut = 30891

	aquaHopper = 32879_000 //TODO -- disable this for now
	atlatl     = 29000
)

// echo leagues stuff
const (
	drygoreBlowpipe = 1000000
	devilElement    = 1000004
	crystalBlessing = 1000005
	glovesDamned    = 1000001
)

// future content
const (
	eyeOfAyak            = 31113
	conflictionGauntlets = 31106
)

var virtusSet = []int{26241, 26243, 26245}
var voidRobes = []int{8839, 8840, 8842}
var eliteVoidRobes = []int{13072, 13073, 8842}
var inquisitorSet = []int{24419, 24420, 24421}
var kerisWeapons = []int{10581, 10582, 10583, 10584, 25979, kerisBreaching, 27291, 27287, kerisAmascut}
var demonBaneWeapons = []int{2402, 6746}

var smokeBattleStaves = []int{11998, 12000}

var dharokSet = []int{4716, 4718, 4720, 4722}

var enchantedRubyBolts = []int{9242, 21944}
var enchantedDiamondBolts = []int{9243, 21946}

var amuletDamned = 12851
var karilSet = []int{4734, 4732, 4736, 4738}
var veracSet = []int{4755, 4753, 4757, 4759}

var corpBaneWeapons = []int{
	1237, 1239, 1241, 1243, 1245, 1247, 1249, 4158, 4580, 4726, 5016, 11824, 20158, //spear
	3190, 3192, 3194, 3196, 3198, 3200, 3202, 3204, 23987, //halberd
	29796,
}

var pickaxes = map[int]int{1265: 1, 1267: 1, 1269: 6, 1271: 31, 1273: 21, 1275: 41, 11920: 61, 12297: 11, 13243: 61, 20014: 61, 23276: 41, 23680: 61}

var wildyWeapons = []int{
	22547, webweaver,
	22552, 27785, accursedSceptre,
	22542, ursineMace,
}

type equippedGear struct {
	ids []int
}

func (gear *equippedGear) isEquipped(itemId int) bool {
	for _, id := range gear.ids {
		if id == itemId {
			return true
		}
	}
	return false
}

func (gear *equippedGear) isAnyEquipped(itemIds []int) bool {
	for _, itemId := range itemIds {
		if gear.isEquipped(itemId) {
			return true
		}
	}
	return false
}

func (gear *equippedGear) isAllEquipped(itemIds []int) bool {
	for _, itemId := range itemIds {
		if !gear.isEquipped(itemId) {
			return false
		}
	}
	return true
}

func (gear *equippedGear) isWearingVoidRobes() bool {
	return gear.isAnyEquipped(voidRobes) || gear.isAnyEquipped(eliteVoidRobes)
}

func (gear *equippedGear) isWearingMeleeVoid() bool {
	return gear.isWearingVoidRobes() && gear.isEquipped(meleeVoidHelm)
}

func (gear *equippedGear) isWearingRangedVoid() bool {
	return gear.isWearingVoidRobes() && gear.isEquipped(rangeVoidHelm)
}

func (gear *equippedGear) isWearingEliteRangedVoid() bool {
	return gear.isAnyEquipped(eliteVoidRobes) && gear.isEquipped(rangeVoidHelm)
}

func (gear *equippedGear) isWearingMageVoid() bool {
	return gear.isWearingVoidRobes() && gear.isEquipped(mageVoidHelm)
}

func (gear *equippedGear) isWearingEliteMageVoid() bool {
	return gear.isAnyEquipped(eliteVoidRobes) && gear.isEquipped(mageVoidHelm)
}

func (gear *equippedGear) isWearingImbuedBlackMask() bool {
	return gear.isEquipped(blackMaskImbued) || gear.isEquipped(slayerHelmImbued)
}
func (gear *equippedGear) isWearingBlackMask() bool {
	return gear.isWearingImbuedBlackMask() || gear.isEquipped(blackMask) || gear.isEquipped(slayerHelm)
}

func (gear *equippedGear) isWearingCorpbaneWeapon(player *Player) bool {
	style := player.combatStyle.CombatStyleType
	isStab := style == Stab

	if gear.isEquipped(osmumtenFang) {
		return isStab
	}

	if gear.isAnyEquipped(corpBaneWeapons) {
		return isStab
	}

	if style == Magic {
		return true
	}

	if player.equippedGear.isEquipped(voidwaker) && player.inputGearSetup.GearSetup.IsSpecialAttack {
		return true
	}

	return false
}

func (gear *equippedGear) getWearingPickaxe() (int, bool) {
	for pickId := range pickaxes {
		if gear.isEquipped(pickId) {
			return pickId, true
		}
	}
	return 0, false
}

// TODO proper check for bolts/arrows? this will give bonus if throwing darts with quiver
func (gear *equippedGear) isBlessedQuiverBonus() bool {
	if gear.isEquipped(blessedQuiver) {
		if gear.isEquipped(blowpipe) || gear.isEquipped(bowfa) || gear.isEquipped(crystalBow) || gear.isEquipped(ralos) || gear.isEquipped(drygoreBlowpipe) {
			return false
		}
		return true
	}
	return false
}

func (gear *equippedGear) getCrystalArmourCount() int {
	crystalPieces := 0
	if gear.isEquipped(crystalHelm) {
		crystalPieces += 1
	}
	if gear.isEquipped(crystalLegs) {
		crystalPieces += 2
	}
	if gear.isEquipped(crystalBody) {
		crystalPieces += 3
	}
	return crystalPieces
}
