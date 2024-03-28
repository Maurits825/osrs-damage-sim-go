package dpscalc

import (
	"slices"

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

	if player.equippedGear.isAllEquipped(dharokSet) && style.isMeleeStyle() {
		maxHp := player.inputGearSetup.GearSetupSettings.CombatStats.Hitpoints
		currentHp := player.inputGearSetup.GearSetup.CurrentHp
		attackDistribution.ScaleDamage(float64(10000+(maxHp-currentHp)*maxHp), 10000)
	}

	//TODO verac, karil, keris

	//TODO cox guardians

	spell := player.inputGearSetup.GearSetup.Spell
	if player.npc.id == iceDemon && (slices.Contains(fireSpells, spell) || spell == "Flames of Zamorak") {
		attackDistribution.ScaleDamage(3, 2)
	}
	if player.equippedGear.isEquipped(tomeOfFire) && slices.Contains(fireSpells, spell) {
		attackDistribution.ScaleDamage(3, 2)
	}
	//TODO tome of water

	//TODO ahrims

	applyNonRubyBoltEffects(player, attackDistribution)

	//TODO corp and corp bane weapons?

	if player.equippedGear.isAnyEquipped(enchantedRubyBolts) && style == Ranged {
		chance := 0.06
		if player.inputGearSetup.GearSetup.IsKandarinDiary {
			chance *= 1.1
		}
		effectDmg := min(100, int(player.npc.BaseCombatStats.Hitpoints/5))
		if player.equippedGear.isEquipped(zaryteCrossbow) {
			effectDmg = min(110, int(player.npc.BaseCombatStats.Hitpoints*22/100))
		}
		attackDistribution.ScaleProbability(1 - chance)
		attackDistribution.Distributions[0].AddWeightedHit(chance, []int{effectDmg})
	}

	//TODO dists limiters (dmg cap, ice demon...)
	applyLimiters(player, attackDistribution)

	return attackDistribution
}

func applyNonRubyBoltEffects(player *player, attackDistribution *attackdist.AttackDistribution) {
	//TODO bolt effects
}

func applyLimiters(player *player, attackDistribution *attackdist.AttackDistribution) {
	spell := player.inputGearSetup.GearSetup.Spell
	if player.npc.id == iceDemon && !slices.Contains(fireSpells, spell) && spell != "Flames of Zamorak" {
		//TODO div transformer --> 3. we basically have to divide each hitsplat(?) by 3
		attackDistribution.ScaleDamage(1, 3)
	}
}
