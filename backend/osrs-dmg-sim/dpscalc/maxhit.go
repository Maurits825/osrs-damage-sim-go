package dpscalc

import "github.com/Maurits825/osrs-damage-sim/osrs-dmg-sim-go/dpscalc/dpsdetail"

func getMaxHit(player *player) int {
	style := player.combatStyle.combatStyleType
	maxHit := 0

	if style == Stab || style == Slash || style == Crush {
		maxHit = getMeleeMaxHit(player)
	} else if style == Ranged {
		maxHit = getRangedMaxHit(player)
	} else if style == Magic {
		maxHit = getMagicMaxHit(player)
	}
	dpsDetailEntries.TrackValue(dpsdetail.MaxHitFinal, maxHit)
	return maxHit
}

func getMeleeMaxHit(player *player) int {
	baseLevel := dpsDetailEntries.TrackAdd(dpsdetail.DamageLevel, player.inputGearSetup.GearSetupSettings.CombatStats.Strength, player.combatStatBoost.Strength)
	effectiveLevel := baseLevel

	for _, prayer := range player.inputGearSetup.GearSetup.Prayers {
		prayerBoost := prayer.getPrayerBoost()
		if prayerBoost.meleeStrenght.denominator != 0 {
			effectiveLevel = dpsDetailEntries.TrackFactor(dpsdetail.DamageLevelPrayer, effectiveLevel, prayerBoost.meleeStrenght.numerator, prayerBoost.meleeStrenght.denominator)
		}
	}

	//TODO soulreaper axe

	stanceBonus := 8
	switch player.combatStyle.combatStyleStance {
	case Aggressive:
		stanceBonus += 3
	case Controlled:
		stanceBonus += 1
	}

	effectiveLevel = dpsDetailEntries.TrackAdd(dpsdetail.DamageEffectiveLevel, effectiveLevel, stanceBonus)

	//TODO melee void

	gearBonus := dpsDetailEntries.TrackAdd(dpsdetail.DamageGearBonus, player.equipmentStats.damageStats.meleeStrength, 64)
	baseMaxHit := dpsDetailEntries.TrackMaxHitFromEffective(dpsdetail.MaxHitBase, effectiveLevel, gearBonus)

	//TODO all other checks here

	return baseMaxHit
}

func getRangedMaxHit(player *player) int {
	baseLevel := dpsDetailEntries.TrackAdd(dpsdetail.DamageLevel, player.inputGearSetup.GearSetupSettings.CombatStats.Ranged, player.combatStatBoost.Ranged)
	effectiveLevel := baseLevel

	for _, prayer := range player.inputGearSetup.GearSetup.Prayers {
		prayerBoost := prayer.getPrayerBoost()
		if prayerBoost.rangedStrength.denominator != 0 {
			effectiveLevel = dpsDetailEntries.TrackFactor(dpsdetail.DamageLevelPrayer, effectiveLevel, prayerBoost.rangedStrength.numerator, prayerBoost.rangedStrength.denominator)
		}
	}

	stanceBonus := 8
	switch player.combatStyle.combatStyleStance {
	case Accurate:
		stanceBonus += 3
	}

	effectiveLevel = dpsDetailEntries.TrackAdd(dpsdetail.DamageEffectiveLevel, effectiveLevel, stanceBonus)

	//TODO ranged void

	gearBonus := dpsDetailEntries.TrackAdd(dpsdetail.DamageGearBonus, player.equipmentStats.damageStats.rangedStrength, 64)
	baseMaxHit := dpsDetailEntries.TrackMaxHitFromEffective(dpsdetail.MaxHitBase, effectiveLevel, gearBonus)

	//TODO all other checks here

	return baseMaxHit
}

func getMagicMaxHit(player *player) int {
	return 0
}
