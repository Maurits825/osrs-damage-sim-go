package dpscalc

const (
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
	accursedSceptre  = 27662
	sangStaff        = 22323
	dawnbringer      = 22516
	warpedSceptre    = 28583

	brimstoneRing = 22975
	osmumtenFang  = 26219

	scythe = 22325

	tomeOfFire = 20714

	zaryteCrossbow = 26374
)

var virtusSet = []int{26241, 26243, 26245}
var voidRobes = []int{8839, 8840, 8842}
var eliteVoidRobes = []int{13072, 13073, 8842}
var inquisitorSet = []int{24419, 24420, 24421}
var kerisWeapons = []int{10581, 10582, 10583, 10584, 25979, kerisBreaching, 27291, 27287}
var demonBaneWeapons = []int{2402, 6746}

var smokeBattleStaves = []int{11998, 12000}

var dharokSet = []int{4716, 4718, 4720, 4722}

var enchantedRubyBolts = []int{9242, 21944}

var karilDamnedSet = []int{4734, 4732, 4736, 4738, 12851}
var veracSet = []int{4755, 4753, 4757, 4759}

var corpBaneWeapons = []int{
	1237, 1239, 1241, 1243, 1245, 1247, 1249, 4158, 4580, 4726, 5016, 11824, 20158, //spear
	3190, 3192, 3194, 3196, 3198, 3200, 3202, 3204, 23987, //halberd
}

var pickaxes = map[int]int{1265: 1, 1267: 1, 1269: 6, 1271: 31, 1273: 21, 1275: 41, 11920: 61, 12297: 11, 13243: 61, 20014: 61, 23276: 41, 23680: 61}

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

func (gear *equippedGear) isWearingCorpbaneWeapon(style combatStyleType) bool {
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
