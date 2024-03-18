package dpscalc

const (
	harmStaff         = 24423
	blowpipe          = 12926
	tumekenShadow     = 27275
	dinhsBulwark      = 21015
	meleeVoidHelm     = 11665
	mageVoidHelm      = 11663
	rangeVoidHelm     = 11664
	salveAmulet       = 4081
	salveAmuletE      = 10588
	salveAmuletI      = 12017
	salveAmuletEI     = 12018
	blackMask         = 8901
	blackMaskImbued   = 11774
	slayerHelm        = 11864
	slayerHelmImbued  = 11865
	arclight          = 19675
	dragonHunterLance = 22978
	kerisBreaching    = 25981
)

var virtusSet = []int{26241, 26243, 26245}
var voidRobes = []int{8839, 8840, 8842}
var eliteVoidRobes = []int{13072, 13073, 8842}
var inquisitorSet = []int{24419, 24420, 24421}

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

func (gear *equippedGear) isWearingVoidRobes() bool {
	return gear.isAnyEquipped(voidRobes) || gear.isAnyEquipped(eliteVoidRobes)
}

func (gear *equippedGear) isWearingMeleeVoid() bool {
	return gear.isWearingVoidRobes() && gear.isEquipped(meleeVoidHelm)
}

func (gear *equippedGear) isWearingImbuedBlackMask() bool {
	return gear.isEquipped(blackMaskImbued) || gear.isEquipped(slayerHelmImbued)
}
func (gear *equippedGear) isWearingBlackMask() bool {
	return gear.isWearingImbuedBlackMask() || gear.isEquipped(blackMask) || gear.isEquipped(slayerHelm)
}
