package dpscalc

import (
	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/dpscalc/attackdist"
)

var scytheHitReduction = []float64{1, 0.5, 0.25}

func getAttackDistribution(player *player, accuracy float64, maxHit int) *attackdist.AttackDistribution {
	//default linear dist
	hitDistribution := attackdist.GetLinearHitDistribution(float64(accuracy), 0, maxHit)
	attackDistribution := attackdist.NewSingleAttackDistribution(*hitDistribution)

	style := player.combatStyle.combatStyleType

	if player.equippedGear.isEquipped(scythe) && style.isMeleeStyle() {
		hitDists := make([]attackdist.HitDistribution, 0)
		totalHits := min(max(player.npc.size, 1), 3)
		for i := 0; i < totalHits; i++ {
			hitDists = append(hitDists, *attackdist.GetLinearHitDistribution(accuracy, 0, int(scytheHitReduction[i]*float64(maxHit))))
		}
		attackDistribution = attackdist.NewMultiAttackDistribution(hitDists)
	}

	if player.equippedGear.isEquipped(osmumtenFang) && style.isMeleeStyle() {
		maxHitReduction := int(maxHit * 3 / 20)
		hitDistribution = attackdist.GetLinearHitDistribution(accuracy, maxHitReduction, maxHit-maxHitReduction)
		attackDistribution = attackdist.NewSingleAttackDistribution(*hitDistribution)
	}

	//TODO gadderhammer

	//TODO dharok test
	if player.equippedGear.isAllEquipped(dharokSet) && style.isMeleeStyle() {
		maxHp := player.inputGearSetup.GearSetupSettings.CombatStats.Hitpoints
		currentHp := player.inputGearSetup.GearSetup.CurrentHp
		attackDistribution.ScaleDamage(float64(10000+(maxHp-currentHp)*maxHp), 10000)
	}

	//TODO other dists

	//TODO dists limiters (dmg cap, ice demon...)

	return attackDistribution
}
