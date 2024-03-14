package damagesim

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
