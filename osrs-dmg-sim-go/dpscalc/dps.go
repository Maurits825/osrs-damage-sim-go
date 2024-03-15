package dpscalc

import (
	"strconv"

	"github.com/Maurits825/osrs-damage-sim/osrs-dmg-sim-go/dpscalc/dpsdetail"
)

const (
	TickLength = 0.6
)

// TODO has snake_case json because response on FE is like that, could refactor in the future

type DpsCalcResults struct {
	Title   string          `json:"title"`
	Results []DpsCalcResult `json:"results"`
}

type DpsCalcResult struct {
	Labels         InputGearSetupLabels `json:"labels"`
	TheoreticalDps float32              `json:"theoretical_dps"`
	MaxHit         []int                `json:"max_hit"`
	Accuracy       float32              `json:"accuracy"`
}

type InputGearSetupLabels struct {
	InputGearSetupLabel    string   `json:"input_gear_setup_label"`
	GearSetupSettingsLabel string   `json:"gear_setup_settings_label"`
	AllWeaponLabels        []string `json:"all_weapon_labels"`
}

var allItems equipmentItems = loadItemWikiData()
var allNpcs npcs = loadNpcWikiData()

// TODO where to put this??, we have to clear it now also...
// is this scuffed? its global... but otherwise have to pass it around everywhere
var dpsDetailEntries *dpsdetail.DetailEntries

func RunDpsCalc(inputSetup *InputSetup) *DpsCalcResults {
	dpsCalcResult := make([]DpsCalcResult, len(inputSetup.InputGearSetups))
	for i, inputGearSetup := range inputSetup.InputGearSetups {
		dpsCalcResult[i] = DpsCalcGearSetup(&inputSetup.GlobalSettings, &inputGearSetup)
	}

	return &DpsCalcResults{"some title", dpsCalcResult}
}

func DpsCalcGearSetup(globalSettings *GlobalSettings, inputGearSetup *InputGearSetup) DpsCalcResult {
	//TODO should dpsdetail do this?
	dpsDetailEntries = &dpsdetail.DetailEntries{
		EntriesMap:  make(map[dpsdetail.DetailKey]dpsdetail.DetailEntry),
		EntriesList: make([]dpsdetail.DetailEntry, 0),
	}

	//TODO refactor labels, in FE also
	inputGearSetupLabels := InputGearSetupLabels{
		"label", "settings label", []string{inputGearSetup.GearSetup.Name},
	}

	player := getPlayer(globalSettings, inputGearSetup)

	dps, maxHit, accuracy := calculateDps(player)

	//TODO get hitsplat maxhits
	return DpsCalcResult{inputGearSetupLabels, dps, []int{maxHit}, accuracy * 100}
	//TODO make that empty tracker thing interface
	// fmt.Println(inputGearSetup.GearSetup.Name + ": " + dpsDetailEntries.SprintFinal())
}

func getPlayer(globalSettings *GlobalSettings, inputGearSetup *InputGearSetup) *player {
	equippedGear := &equippedGear{make([]int, 0)}
	equipmentStats := equipmentStats{}
	for gearSlot, gearItem := range inputGearSetup.GearSetup.Gear {
		//TODO we can get the id alias here so we only have to deal with normal id versions
		itemId := gearItem.Id

		itemStats := allItems[strconv.Itoa(itemId)].equipmentStats
		equipmentStats.addStats(&itemStats)

		equippedGear.ids = append(equippedGear.ids, itemId)

		//TODO other attack speed stuff
		if gearSlot == Weapon {
			equipmentStats.attackSpeed = itemStats.attackSpeed
		}
	}

	//TODO isEquipped(blowpipe) -> addStats(darts)
	//TODO check toa for shadow, dhins, virtus -> these add to equipment stats

	combatStyle := parseCombatStyle(inputGearSetup.GearSetup.AttackStyle)
	combatStatBoost := getPotionBoostStats(inputGearSetup.GearSetupSettings.CombatStats, inputGearSetup.GearSetupSettings.PotionBoosts)

	//TODO prob other stuff to init or get here b4 running calcs
	npc := allNpcs[globalSettings.Npc.Id]
	return &player{globalSettings, inputGearSetup, npc, combatStatBoost, equipmentStats, combatStyle}
}

// TODO basic implementation for now
func calculateDps(player *player) (dps float32, maxHit int, accuracy float32) {
	maxHit = getMaxHit(player)
	accuracy = getAccuracy(player)
	dps = ((float32(maxHit) * accuracy) / 2) / (float32(player.equipmentStats.attackSpeed) * TickLength)

	//TODO just track floats
	dpsDetailEntries.TrackValue(dpsdetail.PlayerDpsFinal, dps)
	return dps, maxHit, accuracy
}

func getAccuracy(player *player) float32 {
	// TODO verzik dawnbringer and scurrius check
	attackRoll := getAttackRoll(player)
	defenceRoll := getNpcDefenceRoll(player)

	accuracy := getNormalAccuracy(attackRoll, defenceRoll)
	dpsDetailEntries.TrackValue(dpsdetail.PlayerAccuracyBase, accuracy)

	//TODO brimstone, fang at toa

	dpsDetailEntries.TrackValue(dpsdetail.PlayerAccuracyFinal, accuracy)
	return accuracy
}

func getNormalAccuracy(attackRoll int, defenceRoll int) float32 {
	if attackRoll > defenceRoll {
		return 1 - (float32(defenceRoll+2) / float32(2*(attackRoll+1)))
	}
	return float32(attackRoll) / float32(2*(defenceRoll+1))
}
