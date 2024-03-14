package dpscalc

import (
	"github.com/Maurits825/osrs-damage-sim/osrs-dmg-sim-go/dpscalc/dpsdetail"
)

func getAttackRoll(player *player) int {
	style := player.combatStyle.combatStyleType
	attackRoll := 0

	if style == Stab || style == Slash || style == Crush {
		attackRoll = getMeleeAttackRoll(player)
	} else if style == Ranged {
		attackRoll = getRangedAttackRoll(player)
	} else if style == Magic {
		attackRoll = getMagicAttackRoll(player)
	}

	dpsDetailEntries.TrackValue(dpsdetail.PlayerAccuracyRollFinal, attackRoll)
	return attackRoll
}

func getMeleeAttackRoll(player *player) int {
	effectiveLevel := dpsDetailEntries.TrackAdd(dpsdetail.PlayerAccuracyLevel, player.inputGearSetup.GearSetupSettings.CombatStats.Attack, player.combatStatBoost.Attack)
	for _, prayer := range player.inputGearSetup.GearSetup.Prayers {
		if factor := prayer.getPrayerBoost().meleeAttack; factor.denominator != 0 {
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

	gearBonus := dpsDetailEntries.TrackAdd(dpsdetail.PlayerAccuracyGearBonus, accuracy, 64)
	baseRoll := dpsDetailEntries.TrackFactor(dpsdetail.PlayerAccuracyRollBase, effectiveLevel, gearBonus, 1)

	//TODO other checks

	return baseRoll
}

func getRangedAttackRoll(player *player) int {
	effectiveLevel := dpsDetailEntries.TrackAdd(dpsdetail.PlayerAccuracyLevel, player.inputGearSetup.GearSetupSettings.CombatStats.Ranged, player.combatStatBoost.Ranged)
	for _, prayer := range player.inputGearSetup.GearSetup.Prayers {
		if factor := prayer.getPrayerBoost().rangedAttack; factor.denominator != 0 {
			effectiveLevel = dpsDetailEntries.TrackFactor(dpsdetail.PlayerAccuracyLevelPrayer, effectiveLevel, factor.numerator, factor.denominator)
		}
	}

	stanceBonus := 8
	switch player.combatStyle.combatStyleStance {
	case Accurate:
		stanceBonus += 3
	}

	effectiveLevel = dpsDetailEntries.TrackAdd(dpsdetail.PlayerAccuracyEffectiveLevel, effectiveLevel, stanceBonus)

	//TODO ranged void

	gearBonus := dpsDetailEntries.TrackAdd(dpsdetail.PlayerAccuracyGearBonus, player.equipmentStats.offensiveStats.ranged, 64)
	baseRoll := dpsDetailEntries.TrackFactor(dpsdetail.PlayerAccuracyRollBase, effectiveLevel, gearBonus, 1)

	//TODO other checks

	return baseRoll
}

func getMagicAttackRoll(player *player) int {
	return 0
}
