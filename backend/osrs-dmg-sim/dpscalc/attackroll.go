package dpscalc

import (
	"math"
	"strings"

	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/dpscalc/dpsdetail"
)

func getAttackRoll(player *player) int {
	style := player.combatStyle.CombatStyleType
	attackRoll := 0

	if style.IsMeleeStyle() {
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

	if player.ragingEchoesMasteries.maxMastery >= 3 {
		attackRoll = dpsDetailEntries.TrackFactor(dpsdetail.PlayerAccuracyREPassive, attackRoll, 2, 1)
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
	switch player.combatStyle.CombatStyleStance {
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
	switch player.combatStyle.CombatStyleType {
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

	if player.equippedGear.isEquipped(crystalBlessing) {
		crystalPieces := player.equippedGear.getCrystalArmourCount()
		attackRoll = int(attackRoll * (20 + crystalPieces) / 20)
	}

	if player.equippedGear.isAnyEquipped([]int{salveAmuletE, salveAmuletEI}) && player.Npc.IsUndead {
		attackRoll = dpsDetailEntries.TrackFactor(dpsdetail.PlayerAccuracySalve, attackRoll, 6, 5)
	} else if player.equippedGear.isAnyEquipped([]int{salveAmulet, salveAmuletI}) && player.Npc.IsUndead {
		attackRoll = dpsDetailEntries.TrackFactor(dpsdetail.PlayerAccuracySalve, attackRoll, 7, 6)
	} else if player.equippedGear.isWearingBlackMask() && player.inputGearSetup.GearSetup.IsOnSlayerTask {
		attackRoll = dpsDetailEntries.TrackFactor(dpsdetail.PlayerAccuracyBlackMask, attackRoll, 7, 6)
	}

	//TODO tzhaar weapon
	if player.inputGearSetup.GearSetup.IsInWilderness && player.equippedGear.isAnyEquipped(wildyWeapons) {
		attackRoll = dpsDetailEntries.TrackFactor(dpsdetail.PlayerAccuracyRevWeapon, attackRoll, 3, 2)
	}
	if player.equippedGear.isAnyEquipped([]int{arclight, emberlight}) && player.Npc.isDemon {
		demonFactor := getDemonbaneFactor(player.Npc.demonbaneVulnerability, 70)
		attackRoll = dpsDetailEntries.TrackAddFactor(dpsdetail.PlayerAccuracyDemonbane, attackRoll, demonFactor.numerator, demonFactor.denominator)
	}
	if player.equippedGear.isEquipped(burningClaws) && player.Npc.isDemon {
		demonFactor := getDemonbaneFactor(player.Npc.demonbaneVulnerability, 5)
		attackRoll = dpsDetailEntries.TrackAddFactor(dpsdetail.PlayerAccuracyDemonbane, attackRoll, demonFactor.numerator, demonFactor.denominator)
	}
	if player.equippedGear.isEquipped(dragonHunterLance) && player.Npc.IsDragon {
		attackRoll = dpsDetailEntries.TrackFactor(dpsdetail.PlayerAccuracyDragonhunter, attackRoll, 6, 5)
	}
	if player.equippedGear.isEquipped(kerisBreaching) && player.Npc.isKalphite {
		attackRoll = dpsDetailEntries.TrackFactor(dpsdetail.PlayerAccuracyKeris, attackRoll, 133, 100)
	}

	//TODO blisterwood

	if player.combatStyle.CombatStyleType == Crush {
		inqCount := 0
		for _, inq := range inquisitorSet {
			if player.equippedGear.isEquipped(inq) {
				inqCount++
			}
		}
		if inqCount > 0 {
			if player.equippedGear.isEquipped(inqMace) {
				inqCount *= 5
			} else if inqCount == 3 {
				inqCount = 5
			}
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
	switch player.combatStyle.CombatStyleStance {
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
	if player.equippedGear.isAnyEquipped([]int{salveAmuletE, salveAmuletEI}) && player.Npc.IsUndead {
		attackRoll = dpsDetailEntries.TrackFactor(dpsdetail.PlayerAccuracySalve, attackRoll, 6, 5)
	} else if player.equippedGear.isAnyEquipped([]int{salveAmulet, salveAmuletI}) && player.Npc.IsUndead {
		attackRoll = dpsDetailEntries.TrackFactor(dpsdetail.PlayerAccuracySalve, attackRoll, 7, 6)
	} else if player.equippedGear.isWearingImbuedBlackMask() && player.inputGearSetup.GearSetup.IsOnSlayerTask {
		attackRoll = dpsDetailEntries.TrackFactor(dpsdetail.PlayerAccuracyBlackMask, attackRoll, 23, 20)
	}

	if player.equippedGear.isEquipped(twistedBow) {
		cap := 250
		if player.Npc.IsXerician {
			cap = 350
		}
		tbowMagic := min(cap, max(player.Npc.CombatStats.Magic, player.Npc.aggressiveStats.magic))
		attackRoll = twistedbowScaling(attackRoll, tbowMagic, true)
	}
	if player.inputGearSetup.GearSetup.IsInWilderness && player.equippedGear.isAnyEquipped(wildyWeapons) {
		attackRoll = dpsDetailEntries.TrackFactor(dpsdetail.PlayerAccuracyRevWeapon, attackRoll, 3, 2)
	}
	if player.equippedGear.isEquipped(dragonHunterCrossbow) && player.Npc.IsDragon {
		attackRoll = dpsDetailEntries.TrackFactor(dpsdetail.PlayerAccuracyDragonhunter, attackRoll, 13, 10)
	}

	if player.equippedGear.isEquipped(scorchingBow) && player.Npc.isDemon {
		demonFactor := getDemonbaneFactor(player.Npc.demonbaneVulnerability, 30)
		attackRoll = dpsDetailEntries.TrackAddFactor(dpsdetail.PlayerAccuracyDemonbane, attackRoll, demonFactor.numerator, demonFactor.denominator)
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
	switch player.combatStyle.CombatStyleStance {
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

	if player.equippedGear.isEquipped(salveAmuletEI) && player.Npc.IsUndead {
		attackRoll = dpsDetailEntries.TrackFactor(dpsdetail.PlayerAccuracySalve, attackRoll, 6, 5)
	} else if player.equippedGear.isEquipped(dragonHunterWand) && player.Npc.IsDragon {
		attackRoll = dpsDetailEntries.TrackFactor(dpsdetail.PlayerAccuracyDragonhunter, attackRoll, 15, 10)
	} else if player.equippedGear.isEquipped(salveAmuletI) && player.Npc.IsUndead {
		attackRoll = dpsDetailEntries.TrackFactor(dpsdetail.PlayerAccuracySalve, attackRoll, 23, 20)
	} else if player.equippedGear.isWearingImbuedBlackMask() && player.inputGearSetup.GearSetup.IsOnSlayerTask {
		attackRoll = dpsDetailEntries.TrackFactor(dpsdetail.PlayerAccuracyBlackMask, attackRoll, 23, 20)
	}

	if strings.Contains(player.spell.name, "Demonbane") && player.Npc.isDemon {
		demonbanePercent := 20

		if player.inputGearSetup.GearSetup.IsMarkOfDarkness {
			demonbanePercent = 40
		}

		if player.equippedGear.isEquipped(purgingStaff) {
			demonbanePercent *= 2
		}

		demonFactor := getDemonbaneFactor(player.Npc.demonbaneVulnerability, demonbanePercent)
		attackRoll = dpsDetailEntries.TrackAddFactor(dpsdetail.PlayerAccuracyDemonbane, attackRoll, demonFactor.numerator, demonFactor.denominator)
	}

	if player.inputGearSetup.GearSetup.IsInWilderness && player.equippedGear.isAnyEquipped(wildyWeapons) {
		attackRoll = dpsDetailEntries.TrackFactor(dpsdetail.PlayerAccuracyRevWeapon, attackRoll, 3, 2)
	}
	if player.equippedGear.isAnyEquipped(smokeBattleStaves) && player.spell.spellbook == standardSpellBook {
		attackRoll = int(float32(attackRoll*11) / float32(10))
	}
	//TODO water tome w/ water spell

	if player.Npc.elementalWeaknessType != NoneElement && player.spell.elementalType != NoneElement {
		if player.Npc.elementalWeaknessType == player.spell.elementalType {
			percent := player.Npc.elementalWeaknessPercent
			if player.equippedGear.isEquipped(devilElement) {
				percent = percent * 2
			}
			attackRoll += int(percent * baseRoll / 100)
		}
	}

	return attackRoll
}

func getSpecialAttackRoll(baseAttackRoll int, player *player) int {
	baseRoll := float32(baseAttackRoll)
	if player.equippedGear.isEquipped(bandosGodsword) || player.equippedGear.isEquipped(zamorakGodsword) || player.equippedGear.isEquipped(armadylGodsword) {
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
	if player.equippedGear.isEquipped(barrelChestAnchor) {
		return int(baseRoll * 2)
	}
	if player.equippedGear.isEquipped(elderMaul) {
		return int(baseRoll * 1.25)
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

	if player.equippedGear.isEquipped(scorchingBow) {
		return int(baseRoll * 1.3)
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
