package dpscalc

import (
	"slices"

	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/dpscalc/attackdist"
)

var scytheHitReduction = []float64{1, 0.5, 0.25}

func getAttackDistribution(player *player, accuracy float64, maxHit int) *attackdist.AttackDistribution {
	//default linear dist
	hitDistribution := attackdist.GetLinearHitDistribution(float64(accuracy), 0, maxHit)
	attackDistribution := attackdist.NewSingleAttackDistribution(hitDistribution)

	style := player.combatStyle.combatStyleType

	if player.equippedGear.isEquipped(scythe) && style.isMeleeStyle() {
		hitDists := make([]attackdist.HitDistribution, 0)
		totalHits := min(max(player.npc.size, 1), 3)
		for i := 0; i < totalHits; i++ {
			hitDists = append(hitDists, attackdist.GetLinearHitDistribution(accuracy, 0, int(scytheHitReduction[i]*float64(maxHit))))
		}
		attackDistribution = attackdist.NewMultiAttackDistribution(hitDists)
	}

	if player.equippedGear.isEquipped(osmumtenFang) && style.isMeleeStyle() {
		maxHitReduction := int(maxHit * 3 / 20)
		hitDistribution = attackdist.GetLinearHitDistribution(accuracy, maxHitReduction, maxHit-maxHitReduction)
		attackDistribution = attackdist.NewSingleAttackDistribution(hitDistribution)
	}

	//TODO gadderhammer

	if player.equippedGear.isAllEquipped(dharokSet) && style.isMeleeStyle() {
		maxHp := player.inputGearSetup.GearSetupSettings.CombatStats.Hitpoints
		currentHp := player.inputGearSetup.GearSetup.CurrentHp
		attackDistribution.ScaleDamage(float64(10000+(maxHp-currentHp)*maxHp), 10000)
	}

	//TODO keris

	if player.equippedGear.isAllEquipped(veracSet) && style.isMeleeStyle() {
		hitDistribution.ScaleProbability(0.75)
		effectHits := attackdist.GetLinearHitDistribution(1.0, 1, maxHit+1)
		effectHits.ScaleProbability(0.25)
		hitDistribution.Hits = append(hitDistribution.Hits, effectHits.Hits...)
		attackDistribution = attackdist.NewSingleAttackDistribution(hitDistribution) //TODO is there a better way instead of this everytime?
	}

	if player.equippedGear.isAllEquipped(karilDamnedSet) && style == Ranged {
		secondHitsplats := make([]attackdist.WeightedHit, len(hitDistribution.Hits))
		for i, weightedHit := range hitDistribution.Hits {
			secondHitsplats[i] = attackdist.WeightedHit{
				Probability: weightedHit.Probability * 0.25,
				Hitsplats:   []int{weightedHit.Hitsplats[0], int(weightedHit.Hitsplats[0] / 2)},
			}
		}

		hitDistribution.ScaleProbability(0.75)
		hitDistribution.Hits = append(hitDistribution.Hits, secondHitsplats...)
		attackDistribution = attackdist.NewSingleAttackDistribution(hitDistribution)
	}

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

	if player.npc.id == corporealBeast && !player.equippedGear.isWearingCorpbaneWeapon(player.combatStyle.combatStyleType) {
		attackDistribution.ScaleDamage(1, 2)
	}

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
		attackDistribution.ScaleDamage(1, 3)
	}

	if slices.Contains(zulrahs, player.npc.id) {
		attackDistribution.CappedReroll(50, 5, 45)
	}
}
