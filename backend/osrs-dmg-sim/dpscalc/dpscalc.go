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
	TickLength   = 0.6
	maxGearSlots = 11
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
	ExpectedHit    float32              `json:"expectedHit"`
	HitDist        []float32            `json:"hitDist"`
	TicksToKill    float32              `json:"ticksToKill"`
	CalcDetails    []string             `json:"calcDetails"`
}

type dpsDetails struct {
	dps          float32
	maxHitsplats []int
	accuracy     float32
	attackRoll   int
	hitDist      []float32
	expectedHit  float32
	attackSpeed  int
}

type InputGearSetupLabels struct {
	GearSetupSettingsLabel string `json:"gearSetupSettingsLabel"`
	GearSetupName          string `json:"gearSetupName"`
}

type DpsCalcOptions struct {
	EnableTrack bool
	CalcHtk     bool
}

var allItems equipmentItems
var allNpcs npcs
var idAliases map[int]int
var specItems map[string]int

// TODO where to put this??, we have to clear it now also...
// is this scuffed? its global... but otherwise have to pass it around everywhere
var dpsDetailEntries = dpsdetail.NewDetailEntries(false)

func init() {
	allItems = getEquipmentItems(wikidata.GetWikiData(wikidata.ItemProvider).(map[int]wikidata.ItemData))
	allNpcs = getNpcs(wikidata.GetWikiData(wikidata.NpcProvider).(map[string]wikidata.NpcData))
	idAliases = wikidata.GetWikiData(wikidata.IdAliasProvider).(map[int]int)
	specItems = wikidata.GetWikiData(wikidata.SpecProvider).(map[string]int)
}

func RunDpsCalc(inputSetup *InputSetup) []*DpsCalcResults {
	var results []*DpsCalcResults
	if len(inputSetup.MultiNpcs) > 0 {
		results = make([]*DpsCalcResults, len(inputSetup.MultiNpcs))
		for i := range inputSetup.MultiNpcs {
			//TODO if we want to go routine, this wont work? we need to pass a copy
			inputSetup.GlobalSettings.Npc = inputSetup.MultiNpcs[i]
			calcResult := RunOneDpsCalc(inputSetup)
			results[i] = calcResult
		}
	} else {
		results = make([]*DpsCalcResults, 1)
		calcResult := RunOneDpsCalc(inputSetup)
		results[0] = calcResult
	}

	return results
}

func RunOneDpsCalc(inputSetup *InputSetup) *DpsCalcResults {
	dpsCalcResult := make([]DpsCalcResult, len(inputSetup.InputGearSetups))
	opts := &DpsCalcOptions{EnableTrack: inputSetup.EnableDebugTrack, CalcHtk: true}
	for i, inputGearSetup := range inputSetup.InputGearSetups {
		dpsCalcResult[i] = DpsCalcGearSetup(&inputSetup.GlobalSettings, &inputGearSetup, opts)
	}

	return &DpsCalcResults{GetDpsCalcTitle(&inputSetup.GlobalSettings), dpsCalcResult}
}

func DpsCalcGearSetup(globalSettings *GlobalSettings, inputGearSetup *InputGearSetup, opt *DpsCalcOptions) DpsCalcResult {
	if opt == nil {
		opt = &DpsCalcOptions{false, false}
	}
	dpsDetailEntries = dpsdetail.NewDetailEntries(opt.EnableTrack)

	inputGearSetupLabels := InputGearSetupLabels{
		GearSetupSettingsLabel: getGearSetupSettingsLabel(&inputGearSetup.GearSetupSettings),
		GearSetupName:          getGearSetupLabel(&inputGearSetup.GearSetup),
	}

	player := GetPlayer(globalSettings, inputGearSetup)
	dpsDetails := calculateDps(player)

	ttk := float32(0.0)
	if opt.CalcHtk {
		htk := getHtk(dpsDetails.hitDist, player.Npc.CombatStats.Hitpoints)
		ttk = htk * float32(dpsDetails.attackSpeed)
	}

	//TODO get hitsplat maxhits

	var calcDetails []string
	if opt.EnableTrack {
		fmt.Println(inputGearSetup.GearSetup.Name + ": " + dpsDetailEntries.SprintFinal())
		calcDetails = dpsDetailEntries.GetAllEntries()
	}

	for i := range dpsDetails.hitDist {
		dpsDetails.hitDist[i] *= 100
	}

	return DpsCalcResult{
		Labels:         inputGearSetupLabels,
		TheoreticalDps: dpsDetails.dps,
		MaxHit:         dpsDetails.maxHitsplats,
		Accuracy:       dpsDetails.accuracy * 100,
		AttackRoll:     dpsDetails.attackRoll,
		ExpectedHit:    dpsDetails.expectedHit,
		HitDist:        dpsDetails.hitDist,
		TicksToKill:    ttk,
		CalcDetails:    calcDetails,
	}
}

func GetNpc(id string) Npc {
	npcId, _ := strconv.Atoi(id)
	npc := allNpcs[id]
	npc.id = npcId
	return npc
}

func getIdAlias(itemId int) int {
	if idAlias, exists := idAliases[itemId]; exists {
		return idAlias
	}
	return itemId
}

func GetPlayer(globalSettings *GlobalSettings, inputGearSetup *InputGearSetup) *Player {
	equippedGear := equippedGear{ids: make([]int, 0, maxGearSlots)}
	equipmentStats := equipmentStats{}
	weaponStyle := "UNARMED"
	specialAttackCost := 0
	is2H := false

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
			specialAttackCost = specItems[item.name]
			is2H = item.is2H
		}
	}

	npc := GetNpc(globalSettings.Npc.Id)
	npc.ApplyAllNpcScaling(globalSettings, inputGearSetup)

	cmbStyle := ParseCombatStyle(inputGearSetup.GearSetup.AttackStyle)
	cmbStyle.Is2H = is2H

	spell := getSpellByName(inputGearSetup.GearSetup.Spell)
	if spell.name != "" {
		cmbStyle = combatStyle{Magic, Autocast, is2H}
	}

	if equippedGear.isEquipped(blowpipe) || equippedGear.isEquipped(drygoreBlowpipe) {
		darts := allItems[inputGearSetup.GearSetup.BlowpipeDarts.Id].equipmentStats
		equipmentStats.addStats(&darts)
	}

	equipmentStats.damageStats.magicStrength *= 10
	inToa := slices.Contains(ToaIds, npc.id)
	if equippedGear.isEquipped(tumekenShadow) && cmbStyle.CombatStyleStance != Autocast {
		shadowFactor := 3
		if inToa {
			shadowFactor = 4
		}
		equipmentStats.damageStats.magicStrength *= float32(shadowFactor)
		equipmentStats.offensiveStats.magic *= shadowFactor
	}

	//TODO the wiki scrapper doesnt get the stab/str stats, so this works for now
	if equippedGear.isEquipped(kerisAmascut) {
		if inToa {
			equipmentStats.offensiveStats.stab += 108
			equipmentStats.damageStats.meleeStrength += 67
		} else {
			equipmentStats.offensiveStats.stab += 58
			equipmentStats.damageStats.meleeStrength += 45
		}
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

	combatStatBoost := GetPotionBoostStats(inputGearSetup.GearSetupSettings.CombatStats, inputGearSetup.GearSetupSettings.PotionBoosts)

	echoMasteries := ragingEchoesMasteries{0, 0, 0, 0}
	if cmbStyle.CombatStyleType.IsMeleeStyle() {
		echoMasteries.melee = inputGearSetup.GearSetupSettings.RagingEchoesSettings.CombatMasteries.MeleeTier
	} else if cmbStyle.CombatStyleType == Ranged {
		echoMasteries.ranged = inputGearSetup.GearSetupSettings.RagingEchoesSettings.CombatMasteries.RangeTier
	} else {
		echoMasteries.mage = inputGearSetup.GearSetupSettings.RagingEchoesSettings.CombatMasteries.MageTier
	}
	echoMasteries.maxMastery = max(echoMasteries.melee, max(echoMasteries.ranged, echoMasteries.mage))

	return &Player{
		globalSettings, inputGearSetup, npc, combatStatBoost,
		equipmentStats, cmbStyle, equippedGear, weaponStyle, specialAttackCost,
		spell, echoMasteries,
	}
}

func GetPlayerHitDist(player *Player) []float32 {
	maxHit := getMaxHit(player)
	accuracy, _ := getAccuracy(player)
	attackDist := getAttackDistribution(player, accuracy, maxHit)
	hitDist := attackDist.GetFlatHitDistribution()
	return hitDist
}

func calculateDps(player *Player) dpsDetails {
	maxHit := getMaxHit(player)
	accuracy, attackRoll := getAccuracy(player)
	attackSpeed := GetAttackSpeed(player)

	attackDist := getAttackDistribution(player, accuracy, maxHit)
	expectedHit := attackDist.GetExpectedHit() + getDoTExpected(player, accuracy)
	hitDist := attackDist.GetFlatHitDistribution()
	maxHitsplats := attackDist.GetMaxHitsplats()

	dps := float32(expectedHit / (float32(attackSpeed) * TickLength))
	dps *= getAttackCycleFactor(attackSpeed, player.inputGearSetup.GearSetupSettings.AttackCycle)

	dpsDetailEntries.TrackValue(dpsdetail.PlayerDpsFinal, dps)
	return dpsDetails{dps, maxHitsplats, accuracy, attackRoll, hitDist, expectedHit, attackSpeed}
}

func GetAttackSpeed(player *Player) int {
	attackSpeed := player.equipmentStats.attackSpeed

	if player.combatStyle.CombatStyleStance == Rapid {
		attackSpeed -= 1
	}

	if player.spell.name != "" {
		if player.equippedGear.isEquipped(harmStaff) && player.spell.spellbook == standardSpellBook {
			return 4
		}
		return 5
	}

	//TODO scurrius 1t weapons
	//TODO eye of ayak spec is 5ticks? -> wiki dps calc doesnt have

	if player.ragingEchoesMasteries.melee >= 5 ||
		player.ragingEchoesMasteries.ranged >= 5 ||
		player.ragingEchoesMasteries.mage >= 5 {
		if attackSpeed >= 5 {
			attackSpeed = int(attackSpeed / 2)
		} else {
			attackSpeed = int(math.Ceil(float64(attackSpeed) / 2))
		}
	} else if player.ragingEchoesMasteries.melee >= 3 ||
		player.ragingEchoesMasteries.ranged >= 3 ||
		player.ragingEchoesMasteries.mage >= 3 {
		attackSpeed = int(attackSpeed * 4 / 5)
	}

	//if we have zero here its because unarmed
	if attackSpeed == 0 {
		attackSpeed = 4
	}
	return attackSpeed
}

func getAccuracy(player *Player) (float32, int) {
	attackRoll := getAttackRoll(player)

	if player.globalSettings.AccuracyBuff ||
		(slices.Contains(verzikIds, player.Npc.id) && player.equippedGear.isEquipped(dawnbringer)) ||
		(player.equippedGear.isEquipped(voidwaker) && player.inputGearSetup.GearSetup.IsSpecialAttack) ||
		(player.equippedGear.isEquipped(boneDagger) && player.inputGearSetup.GearSetup.IsSpecialAttack) ||
		player.ragingEchoesMasteries.ranged == 6 {
		accuracy := float32(1)
		dpsDetailEntries.TrackValue(dpsdetail.PlayerAccuracyFinal, accuracy)
		return accuracy, attackRoll
	}

	// TODO scurrius check

	defenceRoll := getNpcDefenceRoll(player)

	accuracy := getNormalAccuracy(attackRoll, defenceRoll)
	dpsDetailEntries.TrackValue(dpsdetail.PlayerAccuracyBase, accuracy)

	if player.combatStyle.CombatStyleType == Magic && player.equippedGear.isEquipped(brimstoneRing) {
		effectDefenceRoll := int(defenceRoll * 9 / 10)
		effectHitChance := getNormalAccuracy(attackRoll, effectDefenceRoll)
		accuracy = 0.75*accuracy + 0.25*effectHitChance
		dpsDetailEntries.TrackValue(dpsdetail.PlayerAccuracyBrimstone, accuracy)
	}

	if player.equippedGear.isEquipped(osmumtenFang) && player.combatStyle.CombatStyleType == Stab {
		if slices.Contains(ToaIds, player.Npc.id) {
			accuracy = 1 - float32(math.Pow(float64(1-accuracy), 2))
			dpsDetailEntries.TrackValue(dpsdetail.PlayerAccuracyFangTOA, accuracy)
		} else {
			accuracy = getFangEffectAccuracy(attackRoll, defenceRoll)
			dpsDetailEntries.TrackValue(dpsdetail.PlayerAccuracyFang, accuracy)
		}
	}

	if player.equippedGear.isEquipped(conflictionGauntlets) && player.combatStyle.CombatStyleType == Magic && !player.combatStyle.Is2H {
		singleRoll := getNormalAccuracy(attackRoll, defenceRoll)
		doubleRoll := getFangEffectAccuracy(attackRoll, defenceRoll)
		accuracy = doubleRoll / (1 + doubleRoll - singleRoll)
	}

	if player.equippedGear.isEquipped(drygoreBlowpipe) && player.combatStyle.CombatStyleType == Ranged {
		accuracy = getFangEffectAccuracy(attackRoll, defenceRoll)
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

func getFangEffectAccuracy(attackRoll int, defenceRoll int) float32 {
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

func getDoTExpected(player *Player, accuracy float32) float32 {
	if player.equippedGear.isEquipped(burningClaws) && player.inputGearSetup.GearSetup.IsSpecialAttack {
		return burningClawsDoT(accuracy)
	}

	return 0
}

func getHtk(hitDist []float32, npcHp int) float32 {
	hitP := 1 - hitDist[0]
	maxValue := min(npcHp, len(hitDist)-1)
	htk := make([]float32, npcHp+1)

	for hp := 1; hp <= npcHp; hp++ {
		val := float32(1.0)
		maxCapped := min(hp, maxValue)
		for hit := 1; hit <= maxCapped; hit++ {
			p := hitDist[hit]
			val += p * htk[hp-hit]
		}
		htk[hp] = val / hitP
	}

	return htk[npcHp]
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
