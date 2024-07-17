package dpscalc

import (
	"math"

	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/dpscalc/attackdist"
)

func getDragonClawsSpecDist(accuracy float64, maxHit int) *attackdist.AttackDistribution {
	allHits := getDragonClawsSpecHits(accuracy, maxHit)
	missAccuracy := math.Pow(1-accuracy, 4)
	allHits = append(allHits, attackdist.WeightedHit{Probability: missAccuracy * 1 / 3, Hitsplats: []int{0, 0, 0, 0}})
	allHits = append(allHits, attackdist.WeightedHit{Probability: missAccuracy * 2 / 3, Hitsplats: []int{0, 0, 1, 1}})
	return attackdist.NewSingleAttackDistribution(&attackdist.HitDistribution{Hits: allHits})
}

func getBurningClawsSpecDist(accuracy float64, maxHit int) *attackdist.AttackDistribution {
	allHits := getBurningClawsSpecHits(accuracy, maxHit)
	missAccuracy := math.Pow(1-accuracy, 3)
	allHits = append(allHits, attackdist.WeightedHit{Probability: missAccuracy / 5, Hitsplats: []int{0, 0, 0}})
	allHits = append(allHits, attackdist.WeightedHit{Probability: 2 * missAccuracy / 5, Hitsplats: []int{1, 0, 0}})
	allHits = append(allHits, attackdist.WeightedHit{Probability: 2 * missAccuracy / 5, Hitsplats: []int{1, 1, 0}})
	return attackdist.NewSingleAttackDistribution(&attackdist.HitDistribution{Hits: allHits})
}

func getClawsMinMaxHits(roll int, totalRolls int, accuracy float64, baseMaxhit float32, highOffset int) (prob float64, minHit, maxHit int) {
	minHit = int(baseMaxhit * float32((totalRolls - roll)) / 4)
	maxHit = int(baseMaxhit) + minHit + highOffset
	prob = (math.Pow(1-accuracy, float64(roll)) * accuracy) / float64((maxHit - minHit + 1))
	return
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
		h2 = 0
		h3 = 0
		h4 = baseHit + 1
		return
	},
}

var burningClawsHits = []func(baseHit int) (h1, h2, h3 int){
	func(baseHit int) (h1, h2, h3 int) {
		h1 = int(baseHit / 2)
		h2 = int(baseHit / 4)
		h3 = int(baseHit / 4)
		return
	},
	func(baseHit int) (h1, h2, h3 int) {
		h1 = 2
		h2 = int(baseHit/2) - 1
		h3 = int(baseHit/2) - 1
		return
	},
	func(baseHit int) (h1, h2, h3 int) {
		h1 = 1
		h2 = 1
		h3 = int(baseHit - 2)
		return
	},
}

func getDragonClawsSpecHits(baseAccuracy float64, baseMaxHit int) []attackdist.WeightedHit {
	allHits := make([]attackdist.WeightedHit, 0)
	totalRolls := 4
	for rollHit := 0; rollHit < totalRolls; rollHit++ {
		prob, minHit, maxHit := getClawsMinMaxHits(rollHit, totalRolls, baseAccuracy, float32(baseMaxHit), -1)
		hitsplats := make([]attackdist.WeightedHit, maxHit-minHit+1)
		for hit := minHit; hit <= maxHit; hit++ {
			hit1, hit2, hit3, hit4 := dragonClawsHits[rollHit](hit)
			hitsplats[hit-minHit] = attackdist.WeightedHit{Probability: float64(prob), Hitsplats: []int{hit1, hit2, hit3, hit4}}
		}
		allHits = append(allHits, hitsplats...)
	}

	return allHits
}

func getBurningClawsSpecHits(baseAccuracy float64, baseMaxHit int) []attackdist.WeightedHit {
	allHits := make([]attackdist.WeightedHit, 0)
	totalRolls := 3
	for rollHit := 0; rollHit < totalRolls; rollHit++ {
		prob, minHit, maxHit := getClawsMinMaxHits(rollHit, totalRolls, baseAccuracy, float32(baseMaxHit), 0)
		hitsplats := make([]attackdist.WeightedHit, maxHit-minHit+1)
		for hit := minHit; hit <= maxHit; hit++ {
			hit1, hit2, hit3 := burningClawsHits[rollHit](hit)
			hitsplats[hit-minHit] = attackdist.WeightedHit{Probability: float64(prob), Hitsplats: []int{hit1, hit2, hit3}}
		}
		allHits = append(allHits, hitsplats...)
	}

	return allHits
}

func burningClawsDoT(accuracy float64) float64 {
	totalDamage := 0.0
	for roll := 0; roll < 3; roll++ {
		rollHits := (math.Pow(1-accuracy, float64(roll)) * accuracy)
		burnChancePerHit := 0.15 * float64(roll+1)
		totalDamage += 30 * rollHits * burnChancePerHit
	}
	return totalDamage
}
