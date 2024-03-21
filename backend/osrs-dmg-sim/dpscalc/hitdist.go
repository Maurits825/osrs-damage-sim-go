// TODO name of this file, attack dist? then same as other package name...
package dpscalc

import (
	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/dpscalc/attackdist"
)

var scytheHitReduction = []float64{1, 0.5, 0.25}

func getAttackDistribution(player *player, accuracy float64, maxHit int) *attackdist.AttackDistribution {
	//default linear dist
	hitDistribution := attackdist.GetLinearHitDistribution(float64(accuracy), 0, maxHit)
	attackDistribution := attackdist.NewSingleAttackDistribution(*hitDistribution)

	if player.equippedGear.isEquipped(scythe) {
		hitDists := make([]attackdist.HitDistribution, 0)
		totalHits := min(max(player.npc.size, 1), 3)
		for i := 0; i < totalHits; i++ {
			hitDists = append(hitDists, *attackdist.GetLinearHitDistribution(accuracy, 0, int(scytheHitReduction[i]*float64(maxHit))))
		}
		attackDistribution = attackdist.NewMultiAttackDistribution(hitDists)
	}

	return attackDistribution
}
