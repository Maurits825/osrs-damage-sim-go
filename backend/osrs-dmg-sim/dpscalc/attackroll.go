package dpscalc

import (
	"math"
	"slices"

	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/dpscalc/dpsdetail"
)

func getAttackRoll(player *player) int {
	style := player.combatStyle.combatStyleType
	attackRoll := 0

	if style.isMeleeStyle() {
		attackRoll = getMeleeAttackRoll(player)
	} else if style == Ranged {
		attackRoll = getRangedAttackRoll(player)
	} else if style == Magic {
		attackRoll = getMagicAttackRoll(player)
	}

	if player.inputGearSetup.GearSetup.IsSpecialAttack {
		attackRoll = getSpecialAttackRoll(attackRoll, player)
		dpsDetailEntries.TrackValue(dpsdetail.PlayerSpecialAccuracyFinal, attackRoll)
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
	if player.inputGearSetup.GearSetup.IsInWilderness && player.equippedGear.isAnyEquipped(wildyWeapons) {
		attackRoll = dpsDetailEntries.TrackFactor(dpsdetail.PlayerAccuracyRevWeapon, attackRoll, 3, 2)
	}
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

	if player.equippedGear.isWearingRangedVoid() {
		effectiveLevel = dpsDetailEntries.TrackFactor(dpsdetail.PlayerAccuracyEffectiveLevelVoid, effectiveLevel, 11, 10)
	}

	gearBonus := dpsDetailEntries.TrackAdd(dpsdetail.PlayerAccuracyGearBonus, player.equipmentStats.offensiveStats.ranged, 64)
	baseRoll := dpsDetailEntries.TrackFactor(dpsdetail.PlayerAccuracyRollBase, effectiveLevel, gearBonus, 1)

	attackRoll := baseRoll
	if player.equippedGear.isAnyEquipped([]int{bowfa, crystalBow}) {
		crystalPieces := 0
		if player.equippedGear.isEquipped(crystalHelm) {
			crystalPieces += 1
		}
		if player.equippedGear.isEquipped(crystalLegs) {
			crystalPieces += 2
		}
		if player.equippedGear.isEquipped(crystalBody) {
			crystalPieces += 3
		}
		attackRoll = int(attackRoll * (20 + crystalPieces) / 20)
	}

	//TODO avarice amulet
	if player.equippedGear.isAnyEquipped([]int{salveAmuletE, salveAmuletEI}) && player.npc.isUndead {
		attackRoll = dpsDetailEntries.TrackFactor(dpsdetail.PlayerAccuracySalve, attackRoll, 6, 5)
	} else if player.equippedGear.isAnyEquipped([]int{salveAmulet, salveAmuletI}) && player.npc.isUndead {
		attackRoll = dpsDetailEntries.TrackFactor(dpsdetail.PlayerAccuracySalve, attackRoll, 7, 6)
	} else if player.equippedGear.isWearingImbuedBlackMask() && player.inputGearSetup.GearSetup.IsOnSlayerTask {
		attackRoll = dpsDetailEntries.TrackFactor(dpsdetail.PlayerAccuracyBlackMask, attackRoll, 23, 20)
	}

	if player.equippedGear.isEquipped(twistedBow) {
		cap := 250
		if player.npc.IsXerician {
			cap = 350
		}
		tbowMagic := min(cap, max(player.npc.combatStats.Magic, player.npc.aggressiveStats.magic))
		attackRoll = twistedbowScaling(attackRoll, tbowMagic, true)
	}
	if player.inputGearSetup.GearSetup.IsInWilderness && player.equippedGear.isAnyEquipped(wildyWeapons) {
		attackRoll = dpsDetailEntries.TrackFactor(dpsdetail.PlayerAccuracyRevWeapon, attackRoll, 3, 2)
	}
	if player.equippedGear.isEquipped(dragonHunterCrossbow) && player.npc.isDragon {
		attackRoll = dpsDetailEntries.TrackFactor(dpsdetail.PlayerAccuracyDragonhunter, attackRoll, 13, 10)
	}

	return attackRoll
}

func getMagicAttackRoll(player *player) int {
	effectiveLevel := dpsDetailEntries.TrackAdd(dpsdetail.PlayerAccuracyLevel, player.inputGearSetup.GearSetupSettings.CombatStats.Magic, player.combatStatBoost.Magic)
	for _, prayer := range player.inputGearSetup.GearSetup.Prayers {
		if factor := prayer.getPrayerBoost().magicAttack; factor.denominator != 0 {
			//TODO divide 0 here i think with augury...
			effectiveLevel = dpsDetailEntries.TrackFactor(dpsdetail.PlayerAccuracyLevelPrayer, effectiveLevel, factor.numerator, factor.denominator)
		}
	}

	stanceBonus := 9
	switch player.combatStyle.combatStyleStance {
	case Accurate:
		stanceBonus += 2
	}

	effectiveLevel = dpsDetailEntries.TrackAdd(dpsdetail.PlayerAccuracyEffectiveLevel, effectiveLevel, stanceBonus)

	if player.equippedGear.isWearingMageVoid() {
		effectiveLevel = dpsDetailEntries.TrackFactor(dpsdetail.PlayerAccuracyEffectiveLevelVoid, effectiveLevel, 29, 20)
	}

	gearBonus := dpsDetailEntries.TrackAdd(dpsdetail.PlayerAccuracyGearBonus, player.equipmentStats.offensiveStats.magic, 64)
	baseRoll := dpsDetailEntries.TrackFactor(dpsdetail.PlayerAccuracyRollBase, effectiveLevel, gearBonus, 1)

	attackRoll := baseRoll

	//TODO avarice

	if player.equippedGear.isEquipped(salveAmuletEI) && player.npc.isUndead {
		attackRoll = dpsDetailEntries.TrackFactor(dpsdetail.PlayerAccuracySalve, attackRoll, 6, 5)
	} else if player.equippedGear.isEquipped(salveAmuletI) && player.npc.isUndead {
		attackRoll = dpsDetailEntries.TrackFactor(dpsdetail.PlayerAccuracySalve, attackRoll, 23, 20)
	} else if player.equippedGear.isWearingImbuedBlackMask() && player.inputGearSetup.GearSetup.IsOnSlayerTask {
		attackRoll = dpsDetailEntries.TrackFactor(dpsdetail.PlayerAccuracyBlackMask, attackRoll, 23, 20)
	}

	//TODO demonbane spells
	if player.inputGearSetup.GearSetup.IsInWilderness && player.equippedGear.isAnyEquipped(wildyWeapons) {
		attackRoll = dpsDetailEntries.TrackFactor(dpsdetail.PlayerAccuracyRevWeapon, attackRoll, 3, 2)
	}
	if player.equippedGear.isAnyEquipped(smokeBattleStaves) && slices.Contains(standardSpells, player.inputGearSetup.GearSetup.Spell) {
		attackRoll = int(float32(attackRoll*11) / float32(10))
	}
	//TODO water tome w/ water spell

	return attackRoll
}

func getSpecialAttackRoll(baseAttackRoll int, player *player) int {
	baseRoll := float32(baseAttackRoll)
	if player.equippedGear.isEquipped(bandosGodsword) {
		return baseAttackRoll * 2
	}
	if player.equippedGear.isEquipped(osmumtenFang) {
		return int(baseRoll * 1.5)
	}
	if player.equippedGear.isEquipped(abbysalDagger) {
		return int(baseRoll * 1.25)
	}
	if player.equippedGear.isEquipped(dragonDagger) {
		return int(baseRoll * 1.15)
	}
	if player.equippedGear.isEquipped(ursineMace) {
		return int(baseRoll * 2)
	}

	if player.equippedGear.isEquipped(blowpipe) {
		return baseAttackRoll * 2
	}
	if player.equippedGear.isEquipped(zaryteCrossbow) {
		return baseAttackRoll * 2
	}
	if player.equippedGear.isEquipped(webweaver) {
		return baseAttackRoll * 2
	}

	if player.equippedGear.isEquipped(volatileStaff) {
		return int(baseRoll * 1.5)
	}

	return baseAttackRoll
}

func twistedbowScaling(current int, magic int, accuracyMode bool) int {
	factor := 14
	base := 250
	if accuracyMode {
		factor = 10
		base = 140
	}

	t2 := int((3*magic - factor) / 100)
	t3 := int(math.Pow(float64(int(3*magic/10)-(10*factor)), 2) / 100)

	bonus := base + t2 - t3
	return int(current * bonus / 100)
}
