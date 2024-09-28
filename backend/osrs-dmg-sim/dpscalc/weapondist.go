package dpscalc

import (
	"math"
	"slices"

	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/dpscalc/attackdist"
	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/dpscalc/dpsdetail"
)

var scytheHitReduction = []float32{1, 0.5, 0.25}

func getAttackDistribution(player *player, accuracy float32, maxHit int) *attackdist.AttackDistribution {
	//default linear dist
	baseHitDist := attackdist.GetLinearHitDistribution(accuracy, 0, maxHit)
	attackDistribution := attackdist.NewSingleAttackDistribution(baseHitDist)

	style := player.combatStyle.CombatStyleType
	isSpecial := player.inputGearSetup.GearSetup.IsSpecialAttack

	if player.equippedGear.isEquipped(scythe) && style.IsMeleeStyle() {
		totalHits := min(max(player.npc.size, 1), 3)
		hitDists := make([]*attackdist.HitDistribution, totalHits)
		for i := 0; i < totalHits; i++ {
			hitDists[i] = attackdist.GetLinearHitDistribution(accuracy, 0, int(scytheHitReduction[i]*float32(maxHit)))
		}
		attackDistribution = attackdist.NewMultiAttackDistribution(hitDists)
	}

	if player.equippedGear.isEquipped(osmumtenFang) && style.IsMeleeStyle() {
		maxHitReduction := int(maxHit * 3 / 20)
		fangMaxHit := maxHit - maxHitReduction
		if isSpecial {
			fangMaxHit = maxHit
		}
		baseHitDist = attackdist.GetLinearHitDistribution(accuracy, maxHitReduction, fangMaxHit)
		attackDistribution.SetSingleAttackDistribution(baseHitDist)
	}

	if player.equippedGear.isEquipped(dualMachiato) && style.IsMeleeStyle() {
		halfMax := maxHit / 2
		firstDist := attackdist.GetLinearHitDistribution(accuracy, 0, maxHit-halfMax)
		secondDist := attackdist.GetLinearHitDistribution(accuracy, 0, halfMax)

		combineDist := make([]attackdist.WeightedHit, 0)
		for i := range firstDist.Hits {
			firsHit := firstDist.Hits[i]
			if firsHit.Hitsplats[0] == 0 {
				continue
			}
			for j := range secondDist.Hits {
				secondHit := secondDist.Hits[j]
				combineDist = append(combineDist, attackdist.WeightedHit{Probability: firsHit.Probability * secondHit.Probability, Hitsplats: []int{firsHit.Hitsplats[0], secondHit.Hitsplats[0]}})
			}
		}

		combineDist = append(combineDist, attackdist.WeightedHit{Probability: 1 - accuracy, Hitsplats: []int{0, 0}})
		attackDistribution = attackdist.NewSingleAttackDistribution(&attackdist.HitDistribution{Hits: combineDist})
	}

	//TODO gadderhammer

	if player.equippedGear.isAllEquipped(dharokSet) && style.IsMeleeStyle() {
		maxHp := player.inputGearSetup.GearSetupSettings.CombatStats.Hitpoints
		currentHp := player.inputGearSetup.GearSetup.CurrentHp
		attackDistribution.ScaleDamage(float32(10000+(maxHp-currentHp)*maxHp), 10000)
	}

	if player.equippedGear.isAnyEquipped(kerisWeapons) && style.IsMeleeStyle() && player.npc.isKalphite {
		critDist := baseHitDist.Clone()
		critDist.ScaleProbability(1.0 / 51.0)
		critDist.ScaleDamage(3, 1)

		baseHitDist.ScaleProbability(50.0 / 51.0)
		baseHitDist.Hits = append(baseHitDist.Hits, critDist.Hits...)
		attackDistribution.SetSingleAttackDistribution(baseHitDist)
	}

	if player.equippedGear.isAllEquipped(veracSet) && style.IsMeleeStyle() {
		baseHitDist.ScaleProbability(0.75)
		effectHits := attackdist.GetLinearHitDistribution(1.0, 1, maxHit+1)
		effectHits.ScaleProbability(0.25)
		baseHitDist.Hits = append(baseHitDist.Hits, effectHits.Hits...)
		attackDistribution.SetSingleAttackDistribution(baseHitDist)
	}

	if player.equippedGear.isAllEquipped(karilDamnedSet) && style == Ranged {
		secondHitsplats := baseHitDist.Clone()
		secondHitsplats.ScaleProbability(0.25)
		for i := range secondHitsplats.Hits {
			secondHitsplats.Hits[i].Hitsplats = []int{secondHitsplats.Hits[i].Hitsplats[0], int(secondHitsplats.Hits[i].Hitsplats[0] / 2)}
		}

		baseHitDist.ScaleProbability(0.75)
		baseHitDist.Hits = append(baseHitDist.Hits, secondHitsplats.Hits...)
		attackDistribution.SetSingleAttackDistribution(baseHitDist)
	}

	pickId, isPickEquipped := player.equippedGear.getWearingPickaxe()
	if slices.Contains(guardianIds, player.npc.id) && style.IsMeleeStyle() && isPickEquipped {
		pickBonus := pickaxes[pickId]
		factor := float32(50 + player.inputGearSetup.GearSetup.MiningLevel + pickBonus)
		divisor := float32(150.0)
		dpsDetailEntries.TrackValue(dpsdetail.GuardiansDMGBonus, factor/divisor)
		attackDistribution.ScaleDamage(factor, divisor)
	}

	if player.equippedGear.isEquipped(abbysalDagger) && style.IsMeleeStyle() && isSpecial {
		dist := attackdist.GetMultiHitOneRollHitDistribution(accuracy, 0, maxHit, 2)
		attackDistribution.SetSingleAttackDistribution(dist)
	}

	if player.equippedGear.isEquipped(dragonDagger) && style.IsMeleeStyle() && isSpecial {
		dists := []*attackdist.HitDistribution{baseHitDist, baseHitDist}
		attackDistribution = attackdist.NewMultiAttackDistribution(dists)
	}

	if player.equippedGear.isEquipped(crystalHalberd) && style.IsMeleeStyle() && isSpecial {
		dists := []*attackdist.HitDistribution{baseHitDist}
		if player.npc.size > 1 {
			reducedRoll := int(float32(getAttackRoll(player)) * 0.75)
			defenceRoll := getNpcDefenceRoll(player)
			reducedAccuracy := float32(getNormalAccuracy(reducedRoll, defenceRoll))
			reducedDist := attackdist.GetLinearHitDistribution(reducedAccuracy, 0, maxHit)
			dists = append(dists, reducedDist)
		}
		attackDistribution = attackdist.NewMultiAttackDistribution(dists)
	}

	if player.equippedGear.isEquipped(voidwaker) && style.IsMeleeStyle() && isSpecial {
		//TODO min hit based on dps spreadsheet is rounded up
		dist := attackdist.GetLinearHitDistribution(accuracy, int(math.Ceil(float64(maxHit)*0.5)), int(float32(maxHit)*1.5))
		attackDistribution.SetSingleAttackDistribution(dist)
	}

	if player.equippedGear.isEquipped(dragonClaws) && style.IsMeleeStyle() && isSpecial {
		attackDistribution = getDragonClawsSpecDist(accuracy, maxHit)
	}
	if player.equippedGear.isEquipped(burningClaws) && style.IsMeleeStyle() && isSpecial {
		attackDistribution = getBurningClawsSpecDist(accuracy, maxHit)
	}

	if player.equippedGear.isEquipped(webweaver) && style == Ranged && isSpecial {
		totalHits := 4
		hitDists := make([]*attackdist.HitDistribution, totalHits)
		for i := 0; i < totalHits; i++ {
			hitDists[i] = baseHitDist
		}
		attackDistribution = attackdist.NewMultiAttackDistribution(hitDists)
	}

	if player.equippedGear.isEquipped(darkbow) && style == Ranged {
		dists := []*attackdist.HitDistribution{baseHitDist, baseHitDist}
		if isSpecial {
			if player.equippedGear.isEquipped(dragonArrows) {
				bowMax := int(float32(maxHit) * 1.5)
				dist1 := attackdist.GetLinearHitDistribution(accuracy, 0, bowMax)
				dist1.MinMaxCap(8, 48)
				//TODO wiki is kinda confusing, second attack is rolled this way i think, with no min cap
				dist2 := attackdist.GetLinearHitDistribution(accuracy, 0, maxHit)
				dist2.MinMaxCap(0, 48)
				dists[0] = dist1
				dists[1] = dist2
			}
			//TODO non d-arrow spec
		}
		attackDistribution = attackdist.NewMultiAttackDistribution(dists)
	}

	if player.equippedGear.isEquipped(ralos) && style == Ranged {
		if isSpecial {
			//TODO second hit rolls after def reductions if first roll hits ...
			secondHit := attackdist.GetLinearHitDistribution(accuracy, 0, maxHit)
			dists := []*attackdist.HitDistribution{baseHitDist, secondHit}
			attackDistribution = attackdist.NewMultiAttackDistribution(dists)
		} else {
			dists := []*attackdist.HitDistribution{baseHitDist, baseHitDist}
			attackDistribution = attackdist.NewMultiAttackDistribution(dists)
		}

	}

	//TODO tome of water??

	//TODO ahrims

	applyNonRubyBoltEffects(player, baseHitDist, attackDistribution, accuracy, maxHit)

	if player.npc.id == corporealBeast && !player.equippedGear.isWearingCorpbaneWeapon(player) {
		attackDistribution.ScaleDamage(1, 2)
	}

	if player.equippedGear.isAnyEquipped(enchantedRubyBolts) && style == Ranged {
		effectChance := float32(0.06)
		if player.inputGearSetup.GearSetup.IsKandarinDiary {
			effectChance *= 1.1
		}
		effectDmg := min(100, int(player.npc.CombatStats.Hitpoints/5))
		if player.equippedGear.isEquipped(zaryteCrossbow) {
			effectDmg = min(110, int(player.npc.CombatStats.Hitpoints*22/100))
		}
		attackDistribution.ScaleProbability(1 - effectChance)
		attackDistribution.Distributions[0].AddWeightedHit(effectChance, []int{effectDmg})

		if player.equippedGear.isEquipped(zaryteCrossbow) && isSpecial {
			zcbSpecEffectChance := getZcbSpecEffectChance(accuracy, effectChance)
			zcbHitDist := &attackdist.HitDistribution{Hits: []attackdist.WeightedHit{
				{
					Probability: zcbSpecEffectChance,
					Hitsplats:   []int{effectDmg},
				},
				{
					Probability: 1 - zcbSpecEffectChance,
					Hitsplats:   []int{0},
				},
			}}
			attackDistribution.SetSingleAttackDistribution(zcbHitDist)
		}
	}

	//TODO dists limiters (dmg cap, ice demon...)
	applyLimiters(player, attackDistribution)

	return attackDistribution
}

func applyNonRubyBoltEffects(player *player, baseHitDist *attackdist.HitDistribution, attackDistribution *attackdist.AttackDistribution, accuracy float32, maxHit int) {
	//TODO bolt effects
	style := player.combatStyle.CombatStyleType
	isSpecial := player.inputGearSetup.GearSetup.IsSpecialAttack
	kandarinFactor := 1.0
	if player.inputGearSetup.GearSetup.IsKandarinDiary {
		kandarinFactor = 1.1
	}

	if player.equippedGear.isAnyEquipped(enchantedDiamondBolts) && style == Ranged {
		effectChance := float32(0.1 * kandarinFactor)
		zcbFactor := 15
		if player.equippedGear.isEquipped(zaryteCrossbow) {
			zcbFactor = 26
		}
		effectMaxHit := maxHit + int(maxHit*(zcbFactor)/100)

		baseHitDist.ScaleProbability(1 - effectChance)
		effectHits := attackdist.GetLinearHitDistribution(1.0, 0, effectMaxHit)
		effectHits.ScaleProbability(effectChance)
		baseHitDist.Hits = append(baseHitDist.Hits, effectHits.Hits...)

		if player.equippedGear.isEquipped(zaryteCrossbow) && isSpecial {
			zcbHitDist := attackdist.GetLinearHitDistribution(1, 0, effectMaxHit)
			zcbSpecEffectChance := getZcbSpecEffectChance(accuracy, effectChance)
			zcbHitDist.ScaleProbability(zcbSpecEffectChance)
			zcbHitDist.AddWeightedHit(1-zcbSpecEffectChance, []int{0})
			attackDistribution.SetSingleAttackDistribution(zcbHitDist)
		} else {
			attackDistribution.SetSingleAttackDistribution(baseHitDist)
		}
	}
}

func getZcbSpecEffectChance(accuracy, effectChance float32) float32 {
	return accuracy + (1-accuracy)*effectChance
}

func applyLimiters(player *player, attackDistribution *attackdist.AttackDistribution) {
	if player.npc.id == iceDemon && player.spell.elementalType != FireElement {
		attackDistribution.ScaleDamage(1, 3)
	}

	if slices.Contains(zulrahs, player.npc.id) {
		attackDistribution.CappedReroll(50, 5, 45)
	}

	if slices.Contains(verzikP1Ids, player.npc.id) && !player.equippedGear.isEquipped(dawnbringer) {
		limit := 3
		if player.combatStyle.CombatStyleType.IsMeleeStyle() {
			limit = 10
		}
		attackDistribution.LinearMinTransformer(limit, 0)
	}

	//TODO kraken ranged, vasa crystal mage, olm hands,
}
