package dpscalc

import (
	"math"

	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/dpscalc/attackdist"
)

func getDragonClawsSpecDist(accuracy float32, maxHit int) *attackdist.AttackDistribution {
	allHits := getClawsSpecHits(accuracy, maxHit, 4, -1, dragonClawsHits)
	missAccuracy := float32(math.Pow(float64(1-accuracy), 4))
	allHits = append(allHits, attackdist.WeightedHit{Probability: missAccuracy * 1 / 3, Hitsplats: []int{0, 0, 0, 0}})
	allHits = append(allHits, attackdist.WeightedHit{Probability: missAccuracy * 2 / 3, Hitsplats: []int{0, 0, 1, 1}})
	return attackdist.NewSingleAttackDistribution(&attackdist.HitDistribution{Hits: allHits})
}

func getBurningClawsSpecDist(accuracy float32, maxHit int) *attackdist.AttackDistribution {
	allHits := getClawsSpecHits(accuracy, maxHit, 3, 0, burningClawsHits)
	missAccuracy := float32(math.Pow(float64(1-accuracy), 3))
	allHits = append(allHits, attackdist.WeightedHit{Probability: missAccuracy / 5, Hitsplats: []int{0, 0, 0}})
	allHits = append(allHits, attackdist.WeightedHit{Probability: 2 * missAccuracy / 5, Hitsplats: []int{1, 0, 0}})
	allHits = append(allHits, attackdist.WeightedHit{Probability: 2 * missAccuracy / 5, Hitsplats: []int{1, 1, 0}})
	return attackdist.NewSingleAttackDistribution(&attackdist.HitDistribution{Hits: allHits})
}

func getClawsMinMaxHits(roll int, totalRolls int, accuracy float32, baseMaxhit float32, highOffset int) (prob float32, minHit, maxHit int) {
	minHit = int(baseMaxhit * float32((totalRolls - roll)) / 4)
	maxHit = int(baseMaxhit) + minHit + highOffset
	prob = (float32(math.Pow(float64(1-accuracy), float64(roll))) * accuracy) / float32((maxHit - minHit + 1))
	return
}

var dragonClawsHits = []func(baseHit int) []int{
	func(baseHit int) []int {
		return []int{
			int(baseHit / 2),
			int(baseHit / 4),
			int(baseHit / 8),
			int(baseHit/8) + 1,
		}
	},
	func(baseHit int) []int {
		return []int{0,
			int(baseHit / 2),
			int(baseHit / 4),
			int(baseHit/4) + 1,
		}
	},
	func(baseHit int) []int {
		return []int{
			0,
			0,
			int(baseHit / 2),
			int(baseHit/2) + 1,
		}
	},
	func(baseHit int) []int {
		return []int{0, 0, 0, baseHit + 1}
	},
}

var burningClawsHits = []func(baseHit int) []int{
	func(baseHit int) []int {
		return []int{
			int(baseHit / 2),
			int(baseHit / 4),
			int(baseHit / 4),
		}
	},
	func(baseHit int) []int {
		return []int{2,
			max(0, int(baseHit/2)-1),
			max(0, int(baseHit/2)-1),
		}
	},
	func(baseHit int) []int {
		return []int{1, 1, max(0, int(baseHit-2))}
	},
}

func getClawsSpecHits(baseAccuracy float32, baseMaxHit int, totalRolls int, highOffset int, minMaxHits []func(int) []int) []attackdist.WeightedHit {
	allHits := make([]attackdist.WeightedHit, 0, 250) //~50maxhit * 4rolls
	for rollHit := 0; rollHit < totalRolls; rollHit++ {
		prob, minHit, maxHit := getClawsMinMaxHits(rollHit, totalRolls, baseAccuracy, float32(baseMaxHit), highOffset)
		for hit := minHit; hit <= maxHit; hit++ {
			hits := minMaxHits[rollHit](hit)
			allHits = append(allHits, attackdist.WeightedHit{Probability: prob, Hitsplats: hits})
		}
	}

	return allHits
}

func burningClawsDoT(accuracy float32) float32 {
	totalDamage := float32(0.0)
	for roll := 0; roll < 3; roll++ {
		rollHits := float32(math.Pow(float64(1-accuracy), float64(roll)) * float64(accuracy))
		burnChancePerHit := 0.15 * float32(roll+1)
		totalDamage += 30 * rollHits * burnChancePerHit
	}
	return totalDamage
}
