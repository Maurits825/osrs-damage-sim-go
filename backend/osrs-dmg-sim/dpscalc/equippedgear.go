package dpscalc

const (
	harmStaff     = 24423
	blowpipe      = 12926
	tumekenShadow = 27275
	dinhsBulwark  = 21015
)

var virtusSet = []int{26241, 26243, 26245}

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
