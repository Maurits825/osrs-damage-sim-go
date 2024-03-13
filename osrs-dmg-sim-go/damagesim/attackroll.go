package damagesim

import "github.com/Maurits825/osrs-damage-sim/osrs-dmg-sim-go/damagesim/dpsdetail"

func getMeleeAttackRoll(player *player) int {
	effectiveLevel := dpsDetailEntries.TrackAdd(dpsdetail.PlayerAccuracyLevel, player.inputGearSetup.GearSetupSettings.CombatStats.Attack, player.combatStatBoost.Attack)
	for _, prayer := range player.inputGearSetup.GearSetup.Prayers {
		prayerBoost := prayer.getPrayerBoost()
		if factor := prayerBoost.meleeAttack; factor.denominator != 0 {
			effectiveLevel = dpsDetailEntries.TrackFactor(dpsdetail.PlayerAccuracyLevelPrayer, effectiveLevel, factor.numerator, factor.denominator)
		}
	}

	stanceBonus := 8
	switch player.combatStyle.combatStyleStance {
	case Accurate:
		stanceBonus += 3
	case Controlled:
		stanceBonus += 1
	}

	effectiveLevel = dpsDetailEntries.TrackAdd(dpsdetail.PlayerAccuracyEffectiveLevel, effectiveLevel, stanceBonus)

	//TODO melee void

	accuracy := 0
	switch player.combatStyle.combatStyleType {
	case Stab:
		accuracy = player.equipmentStats.offensiveStats.stab
	case Slash:
		accuracy = player.equipmentStats.offensiveStats.slash
	case Crush:
		accuracy = player.equipmentStats.offensiveStats.crush
	}

	gearBonus := dpsDetailEntries.TrackAdd(dpsdetail.DamageGearBonus, accuracy, 64)
	baseRoll := dpsDetailEntries.TrackFactor(dpsdetail.PlayerAccuracyRollBase, effectiveLevel, gearBonus, 1)

	//TODO other checks

	return baseRoll
}

func getRangedAttackRoll(player *player) int {
	return 0
}

func getMagicAttackRoll(player *player) int {
	return 0
}
