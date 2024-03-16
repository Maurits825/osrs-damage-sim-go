// inspired by https://github.com/weirdgloop/osrs-dps-calc/blob/staging/src/lib/CalcDetails.ts
// aim is to keep track of any dps relevant data changes
// for example like UNDEAD_NPC->BASE_MAX_HIT->SALVE_MH->VOID_MH->DHCB_MH->DHCB_ACC ...
package dpsdetail

import (
	"fmt"
	"strings"
)

type DetailKey string

const (
	NPCDefenceRollLevel               DetailKey = "NPC defence level"
	NPCDefenceRollEffectiveLevel      DetailKey = "NPC defence effective level"
	NPCDefenceStatBonus               DetailKey = "NPC defence stat bonus"
	NPCDefenceRollBase                DetailKey = "NPC defence base roll"
	NPCDefenceRollTOA                 DetailKey = "NPC defence ToA roll"
	NPCDefenceRollFinal               DetailKey = "NPC defence roll"
	PlayerAccuracyLevel               DetailKey = "Player accuracy level"
	PlayerAccuracyLevelPrayer         DetailKey = "Player accuracy level prayer"
	PlayerAccuracyEffectiveLevel      DetailKey = "Player accuracy effective level"
	PlayerAccuracyEffectiveLevelVoid  DetailKey = "Player accuracy void effective level"
	PlayerAccuracyGearBonus           DetailKey = "Player accuracy gear bonus"
	PlayerAccuracyRollBase            DetailKey = "Player accuracy base roll"
	PlayerAccuracyObsidianBonus       DetailKey = "Player accuracy obsidian bonus"
	PlayerAccuracyObsidian            DetailKey = "Player accuracy obsidian"
	PlayerAccuracyForinthrySurge      DetailKey = "Player accuracy forinthry surge"
	PlayerAccuracySalve               DetailKey = "Player accuracy salve amulet"
	PlayerAccuracyBlackMask           DetailKey = "Player accuracy black mask"
	PlayerAccuracyRevWeapon           DetailKey = "Player accuracy revenant weapon"
	PlayerAccuracyDemonbane           DetailKey = "Player accuracy demonbane"
	PlayerAccuracyDragonhunter        DetailKey = "Player accuracy dragonhunter"
	PlayerAccuracyKeris               DetailKey = "Player accuracy keris"
	PlayerAccuracyVampyrebane         DetailKey = "Player accuracy vampyrebane"
	PlayerAccuracyInq                 DetailKey = "Player accuracy inquisitor's"
	PlayerAccuracyRollFinal           DetailKey = "Player accuracy roll"
	DamageLevel                       DetailKey = "Damage level"
	DamageLevelPrayer                 DetailKey = "Damage level prayer"
	DamageLevelSoulreaperBonus        DetailKey = "Damage level soulreaper axe bonus"
	DamageLevelSoulreaper             DetailKey = "Damage level soulreaper axe"
	DamageEffectiveLevel              DetailKey = "Damage effective level"
	DamageEffectiveLevelVoid          DetailKey = "Damage void effective level"
	DamageGearBonus                   DetailKey = "Damage gear bonus"
	MaxHitBase                        DetailKey = "Base max hit"
	MaxHitForinthrySurge              DetailKey = "Max hit forinthry surge"
	MaxHitSalve                       DetailKey = "Max hit salve amulet"
	MaxHitBlackMask                   DetailKey = "Max hit black mask"
	MaxHitDemonbane                   DetailKey = "Max hit demonbane"
	MaxHitObsidianBonus               DetailKey = "Max hit obsidian bonus"
	MaxHitObsidian                    DetailKey = "Max hit obsidian"
	MaxHitBerserker                   DetailKey = "Max hit berserker necklace"
	MaxHitDragonhunter                DetailKey = "Max hit dragonhunter"
	MaxHitKeris                       DetailKey = "Max hit keris"
	MaxHitGolembane                   DetailKey = "Max hit golembane"
	MaxHitRevWeapon                   DetailKey = "Max hit revenant weapon"
	MaxHitVampyrebane                 DetailKey = "Max hit vampyrebane"
	MaxHitEfaritay                    DetailKey = "Max hit efaritay's aid"
	MaxHitLeafy                       DetailKey = "Max hit leafy"
	MaxHitColossalblade               DetailKey = "Max hit colossal blade"
	MaxHitInq                         DetailKey = "Max hit inquisitor's"
	MaxHitRatbane                     DetailKey = "Max hit ratbane"
	MaxHitFinal                       DetailKey = "Max hit"
	PlayerAccuracyDawnbringer         DetailKey = "Player accuracy override dawnbringer"
	PlayerAccuracyScurriusRat         DetailKey = "Player accuracy override giant rat"
	PlayerAccuracyBase                DetailKey = "Player accuracy base"
	PlayerAccuracyBrimstone           DetailKey = "Player accuracy brimstone ring"
	PlayerAccuracyFangTOA             DetailKey = "Player accuracy fang toa"
	PlayerAccuracyFang                DetailKey = "Player accuracy fang"
	PlayerAccuracyFinal               DetailKey = "Player accuracy"
	GuardiansDMGBonus                 DetailKey = "Guardians hit multiplier"
	PlayerDefenceRollLevel            DetailKey = "Player defence level"
	PlayerDefenceRollLevelPrayer      DetailKey = "Player defence level prayer"
	PlayerDefenceRollLevelTorags      DetailKey = "Player defence level torags"
	PlayerDefenceRollMagicLevel       DetailKey = "Player defence magic level"
	PlayerDefenceRollMagicLevelPrayer DetailKey = "Player defence magic level prayer"
	PlayerDefenceRollEffectiveLevel   DetailKey = "Player defence effective level"
	PlayerDefenceRollGearBonus        DetailKey = "Player defence gear bonus"
	PlayerDefenceRollFinal            DetailKey = "Player defence roll"
	NPCAccuracyRollBase               DetailKey = "NPC accuracy base roll"
	NPCAccuracyRollBonus              DetailKey = "NPC accuracy bonus"
	NPCAccuracyRollFinal              DetailKey = "NPC accuracy roll"
	PlayerDpsFinal                    DetailKey = "Player dps"
)

type detailEntries struct {
	enableTrack bool
	entriesMap  map[DetailKey]detailEntry
	entriesList []detailEntry
}

type detailEntry struct {
	detailKey DetailKey
	value     string
	operation string
}

var emptyTrackEntries = &detailEntries{
	enableTrack: false,
	entriesMap:  nil,
	entriesList: nil,
}

func NewDetailEntries(enableTrack bool) *detailEntries {
	if !enableTrack {
		return emptyTrackEntries
	}

	dpsDetailEntries := &detailEntries{
		enableTrack: enableTrack,
		entriesMap:  make(map[DetailKey]detailEntry),
		entriesList: make([]detailEntry, 0),
	}

	return dpsDetailEntries
}

func (entries *detailEntries) track(detailKey DetailKey, value interface{}, operation string) {
	if !entries.enableTrack {
		return
	}

	if _, exists := entries.entriesMap[detailKey]; exists {
		fmt.Println("Key exists, should this happen?????: " + detailKey)
		return
	}

	entry := detailEntry{detailKey, fmt.Sprintf("%v", value), operation}
	entries.entriesMap[detailKey] = entry
	entries.entriesList = append(entries.entriesList, entry)
}

func (entries *detailEntries) TrackValue(detailKey DetailKey, value interface{}) {
	entries.track(detailKey, value, "")
}

func (entries *detailEntries) TrackAdd(detailKey DetailKey, base int, add int) int {
	result := base + add
	operation := fmt.Sprintf("%d+%d", base, add)

	entries.track(detailKey, result, operation)
	return result
}

func (entries *detailEntries) TrackFactor(detailKey DetailKey, base int, numerator int, denominator int) int {
	result := int(float32(base*numerator) / float32(denominator))
	operation := fmt.Sprintf("%d * %d/%d", base, numerator, denominator)

	entries.track(detailKey, result, operation)
	return result
}

func (entries *detailEntries) TrackMaxHitFromEffective(detailKey DetailKey, effectiveLevel int, gearBonus int) int {
	result := int(float32(effectiveLevel*gearBonus+320) / 640.0)
	operation := fmt.Sprintf("(%d * %d + 320) / 640", effectiveLevel, gearBonus)
	entries.track(detailKey, result, operation)
	return result
}

var finalKeys []DetailKey = []DetailKey{
	PlayerAccuracyRollFinal, NPCDefenceRollFinal, PlayerAccuracyFinal, MaxHitFinal, PlayerDpsFinal,
}

func (entries *detailEntries) SprintFinal() string {
	final := ""
	for _, detailKey := range finalKeys {
		final += fmt.Sprintf("%s: %s, ", detailKey, entries.entriesMap[detailKey].value)
	}

	final = strings.TrimSuffix(final, ", ")
	return final
}

func (entries *detailEntries) SprintAll() string {
	final := ""
	for detailKey, entry := range entries.entriesMap {
		final += fmt.Sprintf("%s: %s\n", detailKey, entry.value)
	}

	return final
}
