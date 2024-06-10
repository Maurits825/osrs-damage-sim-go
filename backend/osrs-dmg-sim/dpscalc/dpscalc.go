package dpscalc

import (
	"fmt"
	"math"
	"slices"
	"strconv"

	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/dpscalc/dpsdetail"
	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/wikidata"
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
	AttackRoll     int                  `json:"attackRoll"`
	HitDist        []float64            `json:"hitDist"` //TODO float32 vs 64
	CalcDetails    []string             `json:"calcDetails"`
}

type InputGearSetupLabels struct {
	GearSetupSettingsLabel string `json:"gearSetupSettingsLabel"`
	GearSetupName          string `json:"gearSetupName"`
}

var allItems equipmentItems
var allNpcs npcs

// TODO where to put this??, we have to clear it now also...
// is this scuffed? its global... but otherwise have to pass it around everywhere
var dpsDetailEntries = dpsdetail.NewDetailEntries(false)

func init() {
	allItems = getEquipmentItems(wikidata.GetItemData())
	allNpcs = getNpcs(wikidata.GetNpcData())
}

func RunDpsCalc(inputSetup *InputSetup) *DpsCalcResults {
	dpsCalcResult := make([]DpsCalcResult, len(inputSetup.InputGearSetups))
	for i, inputGearSetup := range inputSetup.InputGearSetups {
		dpsCalcResult[i] = DpsCalcGearSetup(&inputSetup.GlobalSettings, &inputGearSetup, inputSetup.EnableDebugTrack)
	}

	return &DpsCalcResults{GetDpsCalcTitle(&inputSetup.GlobalSettings), dpsCalcResult}
}

func DpsCalcGearSetup(globalSettings *GlobalSettings, inputGearSetup *InputGearSetup, enableTrack bool) DpsCalcResult {
	dpsDetailEntries = dpsdetail.NewDetailEntries(enableTrack)

	inputGearSetupLabels := InputGearSetupLabels{
		GearSetupSettingsLabel: getGearSetupSettingsLabel(&inputGearSetup.GearSetupSettings),
		GearSetupName:          getGearSetupLabel(&inputGearSetup.GearSetup),
	}

	player := getPlayer(globalSettings, inputGearSetup)

	dps, maxHitsplats, accuracy, attackRoll, hitDist := calculateDps(player)

	//TODO get hitsplat maxhits

	var calcDetails []string
	if enableTrack {
		fmt.Println(inputGearSetup.GearSetup.Name + ": " + dpsDetailEntries.SprintFinal())
		calcDetails = dpsDetailEntries.GetAllEntries()
	}

	return DpsCalcResult{
		Labels:         inputGearSetupLabels,
		TheoreticalDps: dps,
		MaxHit:         maxHitsplats,
		Accuracy:       accuracy * 100,
		AttackRoll:     attackRoll,
		HitDist:        hitDist,
		CalcDetails:    calcDetails,
	}
}
func GetNpc(id string) npc {
	npcId, _ := strconv.Atoi(id)
	npc := allNpcs[id]
	npc.id = npcId
	return npc
}

func getPlayer(globalSettings *GlobalSettings, inputGearSetup *InputGearSetup) *player {
	equippedGear := equippedGear{make([]int, 0)}
	equipmentStats := equipmentStats{}
	weaponStyle := "UNARMED"
	for gearSlot, gearItem := range inputGearSetup.GearSetup.Gear {
		if gearItem.Id == EmptyItemId {
			continue
		}

		itemId := getIdAlias(gearItem.Id)

		item := allItems[itemId]
		itemStats := item.equipmentStats
		equipmentStats.addStats(&itemStats)

		equippedGear.ids = append(equippedGear.ids, itemId)

		if gearSlot == Weapon {
			equipmentStats.attackSpeed = itemStats.attackSpeed
			weaponStyle = item.weaponStyle
		}
	}

	npc := GetNpc(globalSettings.Npc.Id)
	npc.applyAllNpcScaling(globalSettings, inputGearSetup)

	cmbStyle := parseCombatStyle(inputGearSetup.GearSetup.AttackStyle)
	spell := getSpellByName(inputGearSetup.GearSetup.Spell)
	if spell.name != "" {
		cmbStyle = combatStyle{Magic, Autocast}
	}

	if equippedGear.isEquipped(blowpipe) {
		darts := allItems[inputGearSetup.GearSetup.BlowpipeDarts.Id].equipmentStats
		equipmentStats.addStats(&darts)
	}

	equipmentStats.damageStats.magicStrength *= 10
	if equippedGear.isEquipped(tumekenShadow) && cmbStyle.combatStyleStance != Autocast {
		factor := 3
		if slices.Contains(ToaIds, npc.id) {
			factor = 4
		}
		equipmentStats.damageStats.magicStrength *= factor
		equipmentStats.offensiveStats.magic *= factor
	}

	if spell.spellbook == ancientSpellBook {
		for _, virtus := range virtusSet {
			if equippedGear.isEquipped(virtus) {
				equipmentStats.damageStats.magicStrength += 30
			}
		}
	}

	if equippedGear.isEquipped(dinhsBulwark) {
		defensives := equipmentStats.defensiveStats
		defenceSum := defensives.stab + defensives.slash + defensives.crush + defensives.ranged
		equipmentStats.damageStats.meleeStrength += max(0, int((defenceSum-800)/12)-38)
	}

	if equippedGear.isWearingEliteMageVoid() {
		equipmentStats.damageStats.magicStrength += 50
	}

	if equippedGear.isBlessedQuiverBonus() {
		equipmentStats.offensiveStats.ranged += 10
		equipmentStats.damageStats.rangedStrength += 1
	}

	combatStatBoost := getPotionBoostStats(inputGearSetup.GearSetupSettings.CombatStats, inputGearSetup.GearSetupSettings.PotionBoosts)

	return &player{globalSettings, inputGearSetup, npc, combatStatBoost, equipmentStats, cmbStyle, equippedGear, weaponStyle, spell}
}

func calculateDps(player *player) (dps float32, maxHitsplats []int, accuracy float32, attackRoll int, hitDist []float64) {
	maxHit := getMaxHit(player)
	accuracy, attackRoll = getAccuracy(player)
	attackSpeed := getAttackSpeed(player)

	attackDist := getAttackDistribution(player, float64(accuracy), maxHit)
	expectedHit := attackDist.GetExpectedHit()
	hitDist = attackDist.GetFlatHitDistribution()
	maxHitsplats = attackDist.GetMaxHitsplats()

	dps = float32(expectedHit / (float64(attackSpeed) * TickLength))
	dps *= getAttackCycleFactor(attackSpeed, player.inputGearSetup.GearSetupSettings.AttackCycle)

	dpsDetailEntries.TrackValue(dpsdetail.PlayerDpsFinal, dps)
	return dps, maxHitsplats, accuracy, attackRoll, hitDist
}

func getAttackSpeed(player *player) int {
	attackSpeed := player.equipmentStats.attackSpeed

	if player.combatStyle.combatStyleStance == Rapid {
		attackSpeed -= 1
	}

	if player.spell.name != "" {
		if player.equippedGear.isEquipped(harmStaff) && player.spell.spellbook == standardSpellBook {
			return 4
		}
		return 5
	}

	//TODO scurrius 1t weapons

	//if we have zero here its because unarmed
	if attackSpeed == 0 {
		attackSpeed = 4
	}
	return attackSpeed
}

func getAccuracy(player *player) (float32, int) {
	attackRoll := getAttackRoll(player)

	if (slices.Contains(verzikIds, player.npc.id) && player.equippedGear.isEquipped(dawnbringer)) ||
		(player.equippedGear.isEquipped(voidwaker) && player.inputGearSetup.GearSetup.IsSpecialAttack) ||
		(player.equippedGear.isEquipped(boneDagger) && player.inputGearSetup.GearSetup.IsSpecialAttack) {
		accuracy := float32(1)
		dpsDetailEntries.TrackValue(dpsdetail.PlayerAccuracyDawnbringer, accuracy)
		dpsDetailEntries.TrackValue(dpsdetail.PlayerAccuracyFinal, accuracy)
		return accuracy, attackRoll
	}

	// TODO scurrius check

	defenceRoll := getNpcDefenceRoll(player)

	accuracy := getNormalAccuracy(attackRoll, defenceRoll)
	dpsDetailEntries.TrackValue(dpsdetail.PlayerAccuracyBase, accuracy)

	if player.combatStyle.combatStyleType == Magic && player.equippedGear.isEquipped(brimstoneRing) {
		effectDefenceRoll := int(defenceRoll * 9 / 10)
		effectHitChance := getNormalAccuracy(attackRoll, effectDefenceRoll)
		accuracy = 0.75*accuracy + 0.25*effectHitChance
		dpsDetailEntries.TrackValue(dpsdetail.PlayerAccuracyBrimstone, accuracy)
	}

	if player.equippedGear.isEquipped(osmumtenFang) && player.combatStyle.combatStyleType == Stab {
		if slices.Contains(ToaIds, player.npc.id) {
			accuracy = 1 - float32(math.Pow(float64(1-accuracy), 2))
			dpsDetailEntries.TrackValue(dpsdetail.PlayerAccuracyFangTOA, accuracy)
		} else {
			accuracy = getFangAccuracy(attackRoll, defenceRoll)
			dpsDetailEntries.TrackValue(dpsdetail.PlayerAccuracyFang, accuracy)
		}
	}

	dpsDetailEntries.TrackValue(dpsdetail.PlayerAccuracyFinal, accuracy)
	return accuracy, attackRoll
}

func getNormalAccuracy(attackRoll int, defenceRoll int) float32 {
	if attackRoll > defenceRoll {
		return 1 - (float32(defenceRoll+2) / float32(2*(attackRoll+1)))
	}
	return float32(attackRoll) / float32(2*(defenceRoll+1))
}

func getFangAccuracy(attackRoll int, defenceRoll int) float32 {
	a := float32(attackRoll)
	d := float32(defenceRoll)
	if attackRoll > defenceRoll {
		return 1 - (d+2)*(2*d+3)/(a+1)/(a+1)/6
	}
	return a * (4*a + 5) / 6 / (a + 1) / (d + 1)
}

func getAttackCycleFactor(attackSpeed int, attackCycle int) float32 {
	if attackCycle == 0 || attackSpeed%attackCycle == 0 || attackCycle%attackSpeed == 0 {
		return 1
	}

	d := float32(lcm(attackSpeed, attackCycle) - attackCycle)
	return (d - 1) / d
}

func gcd(a, b int) int {
	for b != 0 {
		a, b = b, a%b
	}
	return a
}
func lcm(a, b int) int {
	return int(math.Abs(float64(a*b)) / float64(gcd(a, b)))
}
