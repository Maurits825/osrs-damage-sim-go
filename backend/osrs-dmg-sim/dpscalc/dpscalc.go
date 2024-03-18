package dpscalc

import (
	"fmt"
	"slices"
	"strconv"

	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/dpscalc/dpsdetail"
)

const (
	TickLength = 0.6
)

type DpsCalcResults struct {
	Title   string          `json:"title"`
	Results []DpsCalcResult `json:"results"`
}

type DpsCalcResult struct {
	Labels         InputGearSetupLabels `json:"labels"`
	TheoreticalDps float32              `json:"theoreticalDps"`
	MaxHit         []int                `json:"maxHit"`
	Accuracy       float32              `json:"accuracy"`
}

type InputGearSetupLabels struct {
	GearSetupSettingsLabel string `json:"gearSetupSettingsLabel"`
	GearSetupName          string `json:"gearSetupName"`
}

var allItems equipmentItems = loadItemWikiData()
var AllNpcs npcs = loadNpcWikiData()

// TODO where to put this??, we have to clear it now also...
// is this scuffed? its global... but otherwise have to pass it around everywhere
// TODO just have a bool to turn track off, and have a NewDetailEntries function
var dpsDetailEntries = dpsdetail.NewDetailEntries(false)

type DpsCalc struct {
}

func RunDpsCalc(inputSetup *InputSetup, enableTrack bool) *DpsCalcResults {
	dpsCalcResult := make([]DpsCalcResult, len(inputSetup.InputGearSetups))
	for i, inputGearSetup := range inputSetup.InputGearSetups {
		dpsCalcResult[i] = DpsCalcGearSetup(&inputSetup.GlobalSettings, &inputGearSetup, enableTrack)
	}

	return &DpsCalcResults{"some title", dpsCalcResult}
}

func DpsCalcGearSetup(globalSettings *GlobalSettings, inputGearSetup *InputGearSetup, enableTrack bool) DpsCalcResult {
	dpsDetailEntries = dpsdetail.NewDetailEntries(enableTrack)

	//TODO refactor labels, in FE also
	inputGearSetupLabels := InputGearSetupLabels{
		GearSetupSettingsLabel: getGearSetupSettingsLabel(&inputGearSetup.GearSetupSettings),
		GearSetupName:          getGearSetupLabel(&inputGearSetup.GearSetup),
	}

	player := getPlayer(globalSettings, inputGearSetup)

	dps, maxHit, accuracy := calculateDps(player)

	//TODO get hitsplat maxhits

	if enableTrack {
		fmt.Println(inputGearSetup.GearSetup.Name + ": " + dpsDetailEntries.SprintFinal())
		// fmt.Println(inputGearSetup.GearSetup.Name + ":")
		// fmt.Print(dpsDetailEntries.SprintAll())
	}
	return DpsCalcResult{inputGearSetupLabels, dps, []int{maxHit}, accuracy * 100}
}

func getPlayer(globalSettings *GlobalSettings, inputGearSetup *InputGearSetup) *player {
	equippedGear := equippedGear{make([]int, 0)}
	equipmentStats := equipmentStats{}
	for gearSlot, gearItem := range inputGearSetup.GearSetup.Gear {
		//TODO we can get the id alias here so we only have to deal with normal id versions
		itemId := gearItem.Id

		itemStats := allItems[strconv.Itoa(itemId)].equipmentStats
		equipmentStats.addStats(&itemStats)

		equippedGear.ids = append(equippedGear.ids, itemId)

		if gearSlot == Weapon {
			equipmentStats.attackSpeed = itemStats.attackSpeed
		}
	}

	if equippedGear.isEquipped(blowpipe) {
		darts := allItems[strconv.Itoa(inputGearSetup.GearSetup.BlowpipeDarts.Id)].equipmentStats
		equipmentStats.addStats(&darts)
	}

	if equippedGear.isEquipped(tumekenShadow) {
		factor := 3
		npcId, _ := strconv.Atoi(globalSettings.Npc.Id)
		if slices.Contains(toaIds, npcId) {
			factor = 4
		}
		equipmentStats.damageStats.magicStrength *= factor
		equipmentStats.offensiveStats.magic *= factor
	}

	if slices.Contains(ancientSpells, inputGearSetup.GearSetup.Spell) {
		for _, virtus := range virtusSet {
			if equippedGear.isEquipped(virtus) {
				equipmentStats.damageStats.magicStrength += 3
			}
		}
	}

	if equippedGear.isEquipped(dinhsBulwark) {
		defensives := equipmentStats.defensiveStats
		defenceSum := defensives.stab + defensives.slash + defensives.crush + defensives.ranged
		equipmentStats.damageStats.meleeStrength += max(0, int((defenceSum-800)/12)-38)
	}

	cmbStyle := parseCombatStyle(inputGearSetup.GearSetup.AttackStyle)
	if inputGearSetup.GearSetup.Spell == "" {
		cmbStyle = combatStyle{Magic, Autocast}
	}

	combatStatBoost := getPotionBoostStats(inputGearSetup.GearSetupSettings.CombatStats, inputGearSetup.GearSetupSettings.PotionBoosts)

	//TODO prob other stuff to init or get here b4 running calcs
	npc := AllNpcs[globalSettings.Npc.Id]
	npc.applyAllNpcScaling(globalSettings, inputGearSetup)
	return &player{globalSettings, inputGearSetup, npc, combatStatBoost, equipmentStats, cmbStyle, equippedGear}
}

// TODO basic implementation for now
func calculateDps(player *player) (dps float32, maxHit int, accuracy float32) {
	maxHit = getMaxHit(player)
	accuracy = getAccuracy(player)

	//TODO wiki has hit distribution and stuff, do we need?
	//maybe just have a post roll dmg mult and stuff is enough, loop through hit splats and also then cap for zulrah/corp
	attackSpeed := getAttackSpeed(player)
	dps = ((float32(maxHit) * accuracy) / 2) / (float32(attackSpeed) * TickLength)

	dpsDetailEntries.TrackValue(dpsdetail.PlayerDpsFinal, dps)
	return dps, maxHit, accuracy
}

func getAttackSpeed(player *player) int {
	attackSpeed := player.equipmentStats.attackSpeed

	if player.combatStyle.combatStyleStance == Rapid {
		attackSpeed -= 1
	}

	spell := player.inputGearSetup.GearSetup.Spell
	if spell != "" {
		if player.equippedGear.isEquipped(harmStaff) && slices.Contains(standardSpells, player.inputGearSetup.GearSetup.Spell) {
			//todo harm check
			return 4
		}
		return 5
	}

	//TODO scurrius 1t weapons

	return attackSpeed
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
