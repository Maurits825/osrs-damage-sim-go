package simpledmgsim

import "math/rand/v2"

//todo basic stuff for now
type weapon struct {
	maxAttackRoll  int
	maxDefenceRoll int
	maxHit         int
}

func (w *weapon) attack() int {
	damage := 0
	if w.rollAccuracy() {
		damage = w.rollDamage()
	}
	return damage
}

func (w *weapon) rollAccuracy() bool {
	//TODO figure out perf of this rand
	//TODO +1 because roll need to be inclusive?
	attackRoll := rand.IntN(w.maxAttackRoll + 1)
	defenceRoll := rand.IntN(w.maxDefenceRoll + 1)
	return attackRoll > defenceRoll
}

func (w *weapon) rollDamage() int {
	damage := rand.IntN(w.maxHit + 1)
	return max(damage, 1)
}
