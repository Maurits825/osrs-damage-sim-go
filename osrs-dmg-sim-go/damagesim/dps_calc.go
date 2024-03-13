package damagesim

import (
	"fmt"
	"strconv"

	"github.com/Maurits825/osrs-damage-sim/osrs-dmg-sim-go/damagesim/dpsdetail"
)

// TODO has snake_case json because response on FE is like that, could refactor in the future
type DpsCalcResults struct {
	Results             []DpsCalcResult `json:"results"`
	GlobalSettingsLabel string          `json:"global_settings_label"`
}

type DpsCalcResult struct {
	Labels         InputGearSetupLabels `json:"labels"`
	TheoreticalDps []float32            `json:"theoretical_dps"`
	MaxHit         []int                `json:"max_hit"`
	Accuracy       []float32            `json:"accuracy"`
}

type InputGearSetupLabels struct {
	InputGearSetupLabel    string   `json:"input_gear_setup_label"`
	GearSetupSettingsLabel string   `json:"gear_setup_settings_label"`
	AllWeaponLabels        []string `json:"all_weapon_labels"`
}

var allItems equipmentItems = loadItemWikiData()

// TODO where to put this??, we have to clear it now also...
var dpsDetailEntries dpsdetail.DetailEntries

func RunDpsCalc(inputSetup *InputSetup) *DpsCalcResults {
	dpsDetailEntries = dpsdetail.DetailEntries{}
	dpsCalcResults := DpsCalcResults{make([]DpsCalcResult, len(inputSetup.InputGearSetups)), "Global settings label"}

	for i, inputGearSetup := range inputSetup.InputGearSetups {
		//run for just main now, will be like that in the future??
		inputGearSetupLabels := InputGearSetupLabels{
			"label", "settings label", []string{inputGearSetup.GearSetup.Name},
		}

		player := getPlayer(&inputSetup.GlobalSettings, &inputGearSetup)
		//TODO calc maxhit based on player?

		dps := []float32{1.23}
		//TODO this gets max hit, also be able to get hitsplats?
		maxHit := getMaxHit(player)
		accuracy := []float32{87.44}
		dpsCalcResults.Results[i] = DpsCalcResult{inputGearSetupLabels, dps, []int{maxHit}, accuracy}
	}

	//TODO for debug, return in results also?
	for _, entry := range dpsDetailEntries.GetEntries() {
		fmt.Println(entry)
	}

	return &dpsCalcResults
}

func getPlayer(globalSettings *GlobalSettings, inputGearSetup *InputGearSetup) *player {
	equippedGear := &equippedGear{make([]int, 0)}
	equipmentStats := equipmentStats{}
	for _, gearItem := range inputGearSetup.GearSetup.Gear {
		//TODO we can get the id alias here so we only have to deal with normal id versions
		itemId := gearItem.Id

		itemStats := allItems[strconv.Itoa(itemId)].equipmentStats
		equipmentStats.addStats(&itemStats)

		equippedGear.ids = append(equippedGear.ids, itemId)
	}

	//TODO isEquipped(blowpipe) -> addStats(darts)
	//TODO check toa for shadow, dhins, virtus -> these add to equipment stats

	combatStyle := parseCombatStyle(inputGearSetup.GearSetup.AttackStyle)
	combatStatBoost := getPotionBoostStats(inputGearSetup.GearSetupSettings.CombatStats, inputGearSetup.GearSetupSettings.PotionBoosts)

	//TODO prob other stuff to init or get here b4 running calcs
	return &player{globalSettings, inputGearSetup, combatStatBoost, equipmentStats, combatStyle}
}

// TODO
func calculateDps(player *player) (dps float32, maxHit []int, accuracy float32) {

	return 1, []int{1}, 50.65
}

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
