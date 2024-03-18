package dpscalc

import "github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/dpscalc/dpsdetail"

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

	if player.equippedGear.isEquipped(soulreaperAxe) {
		stacks := 5 //TODO stack input
		bonus := dpsDetailEntries.TrackFactor(dpsdetail.DamageLevelSoulreaperBonus, baseLevel, stacks*6, 100)
		effectiveLevel = dpsDetailEntries.TrackAdd(dpsdetail.DamageLevelSoulreaper, effectiveLevel, bonus)
	}

	stanceBonus := 8
	switch player.combatStyle.combatStyleStance {
	case Aggressive:
		stanceBonus += 3
	case Controlled:
		stanceBonus += 1
	}

	effectiveLevel = dpsDetailEntries.TrackAdd(dpsdetail.DamageEffectiveLevel, effectiveLevel, stanceBonus)

	if player.equippedGear.isWearingMeleeVoid() {
		effectiveLevel = dpsDetailEntries.TrackFactor(dpsdetail.DamageEffectiveLevelVoid, effectiveLevel, 11, 10)
	}

	gearBonus := dpsDetailEntries.TrackAdd(dpsdetail.DamageGearBonus, player.equipmentStats.damageStats.meleeStrength, 64)
	baseMaxHit := dpsDetailEntries.TrackMaxHitFromEffective(dpsdetail.MaxHitBase, effectiveLevel, gearBonus)

	//TODO avarice amulet
	maxHit := baseMaxHit
	if player.equippedGear.isAnyEquipped([]int{salveAmuletE, salveAmuletEI}) && player.npc.isUndead {
		maxHit = dpsDetailEntries.TrackFactor(dpsdetail.MaxHitSalve, maxHit, 6, 5)
	} else if player.equippedGear.isAnyEquipped([]int{salveAmulet, salveAmuletI}) && player.npc.isUndead {
		maxHit = dpsDetailEntries.TrackFactor(dpsdetail.MaxHitSalve, maxHit, 7, 6)
	} else if player.equippedGear.isWearingBlackMask() && player.inputGearSetup.GearSetup.IsOnSlayerTask {
		maxHit = dpsDetailEntries.TrackFactor(dpsdetail.PlayerAccuracyBlackMask, maxHit, 7, 6)
	}

	//TODO tzhaar weapon, rev weapon, barronite, blister wood, flail, ef aid, rat bone

	if player.equippedGear.isEquipped(arclight) && player.npc.isDemon {
		num, denom := getDemonbaneFactor(player.globalSettings.Npc.Id, 7, 10)
		maxHit = dpsDetailEntries.TrackFactor(dpsdetail.PlayerAccuracyDemonbane, maxHit, num, denom)
	}
	if player.equippedGear.isEquipped(dragonHunterLance) && player.npc.isDragon {
		maxHit = dpsDetailEntries.TrackFactor(dpsdetail.PlayerAccuracyDragonhunter, maxHit, 6, 5)
	}
	if player.equippedGear.isAnyEquipped(kerisWeapons) && player.npc.isKalphite {
		maxHit = dpsDetailEntries.TrackFactor(dpsdetail.PlayerAccuracyKeris, maxHit, 133, 100)
	}
	if player.equippedGear.isAnyEquipped(demonBaneWeapons) && player.npc.isDemon {
		num, denom := getDemonbaneFactor(player.globalSettings.Npc.Id, 3, 5)
		maxHit = dpsDetailEntries.TrackFactor(dpsdetail.PlayerAccuracyDemonbane, maxHit, num, denom)
	}
	if player.equippedGear.isEquipped(leafBladedAxe) && player.npc.isLeafy {
		maxHit = dpsDetailEntries.TrackFactor(dpsdetail.MaxHitLeafy, maxHit, 47, 40)
	}
	if player.equippedGear.isEquipped(colossalBlade) {
		maxHit = dpsDetailEntries.TrackFactor(dpsdetail.MaxHitColossalblade, maxHit, min(0, player.npc.size), 10)
	}

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
			maxHit = dpsDetailEntries.TrackFactor(dpsdetail.MaxHitInq, maxHit, 200+inqCount, 200)
		}
	}

	return maxHit
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
