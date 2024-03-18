package dpscalc

import (
	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/dpscalc/dpsdetail"
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

	if player.equippedGear.isWearingMeleeVoid() {
		effectiveLevel = dpsDetailEntries.TrackFactor(dpsdetail.PlayerAccuracyEffectiveLevelVoid, effectiveLevel, 11, 10)
	}

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

	//TODO avarice amulet
	attackRoll := baseRoll
	if player.equippedGear.isAnyEquipped([]int{salveAmuletE, salveAmuletEI}) && player.npc.isUndead {
		attackRoll = dpsDetailEntries.TrackFactor(dpsdetail.PlayerAccuracySalve, attackRoll, 6, 5)
	} else if player.equippedGear.isAnyEquipped([]int{salveAmulet, salveAmuletI}) && player.npc.isUndead {
		attackRoll = dpsDetailEntries.TrackFactor(dpsdetail.PlayerAccuracySalve, attackRoll, 7, 6)
	} else if player.equippedGear.isWearingBlackMask() && player.inputGearSetup.GearSetup.IsOnSlayerTask {
		attackRoll = dpsDetailEntries.TrackFactor(dpsdetail.PlayerAccuracyBlackMask, attackRoll, 7, 6)
	}

	//TODO tzhaar weapon
	//TODO rev weapon

	if player.equippedGear.isEquipped(arclight) && player.npc.isDemon {
		num, denom := getDemonbaneFactor(player.globalSettings.Npc.Id, 7, 10)
		attackRoll = dpsDetailEntries.TrackFactor(dpsdetail.PlayerAccuracyDemonbane, attackRoll, num, denom)
	}
	if player.equippedGear.isEquipped(dragonHunterLance) && player.npc.isDragon {
		attackRoll = dpsDetailEntries.TrackFactor(dpsdetail.PlayerAccuracyDragonhunter, attackRoll, 6, 5)
	}
	if player.equippedGear.isEquipped(kerisBreaching) && player.npc.isKalphite {
		attackRoll = dpsDetailEntries.TrackFactor(dpsdetail.PlayerAccuracyKeris, attackRoll, 133, 100)
	}

	//TODO blisterwood

	if player.combatStyle.combatStyleType == Crush {
		inqCount := 0
		for _, inq := range inquisitorSet {
			if player.equippedGear.isEquipped(inq) {
				inqCount++
			}
		}
		if inqCount == 3 {
			inqCount = 5
		}
		if inqCount > 0 {
			attackRoll = dpsDetailEntries.TrackFactor(dpsdetail.PlayerAccuracyInq, attackRoll, 200+inqCount, 200)
		}
	}

	return attackRoll
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
