package dpscalc

import (
	"math"

	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/dpscalc/attackdist"
)

func getClawsMinMaxHits(roll int, totalRolls int, accuracy float64, baseMaxhit float32, highOffset int) (prob float64, minHit, maxHit int) {
	minHit = int(baseMaxhit * float32((totalRolls - roll)) / 4)
	maxHit = int(baseMaxhit) + minHit + highOffset
	prob = (math.Pow(float64(1-accuracy), float64(roll)) * accuracy) / float64((maxHit - minHit + 1))
	return
}

func getDragonClawsSpecDist(accuracy float64, maxHit int) *attackdist.AttackDistribution {
	allHits := getDragonClawsSpecHits(accuracy, maxHit)
	//add 0-0-0-0 and 0-0-1-1 hits
	missAccuracy := math.Pow(1-accuracy, 4)
	allHits = append(allHits, attackdist.WeightedHit{Probability: missAccuracy * 1 / 3, Hitsplats: []int{0, 0, 0, 0}})
	allHits = append(allHits, attackdist.WeightedHit{Probability: missAccuracy * 2 / 3, Hitsplats: []int{0, 0, 1, 1}})
	return attackdist.NewSingleAttackDistribution(&attackdist.HitDistribution{Hits: allHits})
}

var dragonClawsMinMaxHits = []func(baseMaxHit float32) (minHit, maxHit int){
	func(baseMaxHit float32) (minHit int, maxHit int) {
		return int(baseMaxHit / 2.0), int(baseMaxHit - 1)
	},
	func(baseMaxHit float32) (minHit int, maxHit int) {
		return int(baseMaxHit * 3.0 / 8.0), int(baseMaxHit * 7.0 / 8.0)
	},
	func(baseMaxHit float32) (minHit int, maxHit int) {
		return int(baseMaxHit * 1.0 / 4.0), int(baseMaxHit * 3.0 / 4.0)
	},
	func(baseMaxHit float32) (minHit int, maxHit int) {
		return int(baseMaxHit * 1.0 / 4.0), int(baseMaxHit * 5.0 / 4.0)
	},
}

var dragonClawsHits = []func(baseHit int) (h1, h2, h3, h4 int){
	func(baseHit int) (h1, h2, h3, h4 int) {
		h1 = int(baseHit / 2)
		h2 = int(baseHit / 4)
		h3 = int(baseHit / 8)
		h4 = int(baseHit/8) + 1
		return
	},
	func(baseHit int) (h1, h2, h3, h4 int) {
		h1 = 0
		h2 = int(baseHit / 2)
		h3 = int(baseHit / 4)
		h4 = int(baseHit/4) + 1
		return
	},
	func(baseHit int) (h1, h2, h3, h4 int) {
		h1 = 0
		h2 = 0
		h3 = int(baseHit / 2)
		h4 = int(baseHit/2) + 1
		return
	},
	func(baseHit int) (h1, h2, h3, h4 int) {
		h1 = 0
		h1 = 0
		h2 = 0
		h3 = 0
		h4 = baseHit + 1
		return
	},
}

func getDragonClawsSpecHits(baseAccuracy float64, baseMaxHit int) []attackdist.WeightedHit {
	allHits := make([]attackdist.WeightedHit, 0)
	for rollHit := 0; rollHit < 4; rollHit++ {
		prob, minHit, maxHit := getClawsMinMaxHits(rollHit, 4, baseAccuracy, float32(baseMaxHit), -1)
		hitsplats := make([]attackdist.WeightedHit, maxHit-minHit+1)
		//iterate through and add the 4 hitsplats
		for hit := minHit; hit <= maxHit; hit++ {
			hit1, hit2, hit3, hit4 := dragonClawsHits[rollHit](hit)
			hitsplats[hit-minHit] = attackdist.WeightedHit{Probability: float64(prob), Hitsplats: []int{hit1, hit2, hit3, hit4}}
		}
		allHits = append(allHits, hitsplats...)
	}

	return allHits
}
