package wikishortlink

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"strings"

	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/dpscalc"
)

type itemId struct {
	Id int `json:"id"`
}

type Equipment struct {
	Ammo   itemId `json:"ammo"`
	Body   itemId `json:"body"`
	Cape   itemId `json:"cape"`
	Feet   itemId `json:"feet"`
	Hands  itemId `json:"hands"`
	Head   itemId `json:"head"`
	Legs   itemId `json:"legs"`
	Neck   itemId `json:"neck"`
	Ring   itemId `json:"ring"`
	Shield itemId `json:"shield"`
	Weapon itemId `json:"weapon"`
}

type Skills struct {
	Atk    int `json:"atk"`
	Def    int `json:"def"`
	HP     int `json:"hp"`
	Magic  int `json:"magic"`
	Mining int `json:"mining"`
	Prayer int `json:"prayer"`
	Ranged int `json:"ranged"`
	Str    int `json:"str"`
}

type Buffs struct {
	Potions       []int `json:"potions"`
	InWilderness  bool  `json:"inWilderness"`
	KandarinDiary bool  `json:"kandarinDiary"`
	OnSlayerTask  bool  `json:"onSlayerTask"`
}

type Style struct {
	Name   string `json:"name"`
	Stance string `json:"stance"`
	Type   string `json:"type"`
}

type Spell struct {
	Name string `json:"name"`
}

type Loadout struct {
	Name      string    `json:"name"`
	Style     Style     `json:"style"`
	Skills    Skills    `json:"skills"`
	Boosts    Skills    `json:"boosts"`
	Equipment Equipment `json:"equipment"`
	Prayers   []int     `json:"prayers"`
	Buffs     Buffs     `json:"buffs"`
	Spell     Spell     `json:"spell"`
}

type DefenceReductions struct {
	Accursed      bool `json:"accursed"`
	Arclight      int  `json:"arclight"`
	Bgs           int  `json:"bgs"`
	Dwh           int  `json:"dwh"`
	ElderMaul     int  `json:"elderMaul"`
	Vulnerability bool `json:"vulnerability"`
}

type MonsterInputs struct {
	DefenceReductions   DefenceReductions `json:"defenceReductions"`
	IsFromCoxCm         bool              `json:"isFromCoxCm"`
	PartyAvgMiningLevel int               `json:"partyAvgMiningLevel"`
	PartyMaxCombatLevel int               `json:"partyMaxCombatLevel"`
	PartyMaxHpLevel     int               `json:"partyMaxHpLevel"`
	PartySize           int               `json:"partySize"`
	ToaInvocationLevel  int               `json:"toaInvocationLevel"`
	ToaPathLevel        int               `json:"toaPathLevel"`
}

type Monster struct {
	Id            int           `json:"id"`
	MonsterInputs MonsterInputs `json:"inputs"`
}

type ShortlinkData struct {
	Loadouts []Loadout `json:"loadouts"`
	Monster  Monster   `json:"monster"`
}

type wikiDpsShortLink struct {
	Data string `json:"data"`
}

const shortLinkEndpoint = "https://tools.runescape.wiki/osrs-dps/shortlink"
const wikiDpsUrl = "https://dps.osrs.wiki"

// TODO figure out error stuff
func CreateWikiDpsShortlink(inputSetup dpscalc.InputSetup) string {
	shortlinkData := buildShortlinkData(inputSetup)
	jsonData, err := json.Marshal(shortlinkData)
	if err != nil {
		fmt.Println("Error marshalling to JSON:", err)
		return ""
	}

	req, err := http.NewRequest("POST", shortLinkEndpoint, bytes.NewBuffer(jsonData))
	if err != nil {
		fmt.Println("Error creating request:", err)
		return ""
	}

	req.Header.Set("Content-Type", "application/json; charset=utf-8")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error sending request:", err)
		return ""
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Error reading response body:", err)
		return ""
	}

	var shortLink wikiDpsShortLink
	err = json.Unmarshal(respBody, &shortLink)
	if err != nil {
		fmt.Println("Error unmarshalling response body:", err)
		return ""
	}

	return wikiDpsUrl + "?id=" + shortLink.Data
}

func buildShortlinkData(inputSetup dpscalc.InputSetup) ShortlinkData {
	loadouts := make([]Loadout, len(inputSetup.InputGearSetups))
	for i, inputGearSetup := range inputSetup.InputGearSetups {
		loadouts[i] = buildLoadout(inputGearSetup)
	}

	//TODO wiki only has stat drain on npc, not per setup, so just take first for now
	monster := buildMonster(inputSetup.GlobalSettings, inputSetup.InputGearSetups[0].GearSetupSettings.StatDrain)
	return ShortlinkData{
		Loadouts: loadouts,
		Monster:  monster,
	}
}

func buildMonster(globalSettings dpscalc.GlobalSettings, statDrains []dpscalc.StatDrain) Monster {
	npcId, _ := strconv.Atoi(globalSettings.Npc.Id)
	inputs := MonsterInputs{
		DefenceReductions:   buildDefenceReduction(statDrains),
		IsFromCoxCm:         globalSettings.CoxScaling.IsChallengeMode,
		PartyAvgMiningLevel: globalSettings.CoxScaling.PartyAvgMiningLevel,
		PartyMaxCombatLevel: globalSettings.CoxScaling.PartyMaxCombatLevel,
		PartyMaxHpLevel:     globalSettings.CoxScaling.PartyMaxHpLevel,
		PartySize:           globalSettings.TeamSize,
		ToaInvocationLevel:  globalSettings.RaidLevel,
		ToaPathLevel:        globalSettings.PathLevel,
	}

	return Monster{
		Id:            npcId,
		MonsterInputs: inputs,
	}
}

func buildDefenceReduction(statDrains []dpscalc.StatDrain) DefenceReductions {
	defenceReductions := DefenceReductions{
		Accursed:      false,
		Arclight:      0,
		Bgs:           0,
		Dwh:           0,
		ElderMaul:     0,
		Vulnerability: false,
	}

	for _, statDrain := range statDrains {
		switch statDrain.Name {
		case dpscalc.AccursedSceptre:
			defenceReductions.Accursed = true
		case dpscalc.Arclight:
			defenceReductions.Arclight += statDrain.Value
		case dpscalc.BandosGodsword:
			defenceReductions.Bgs += statDrain.Value
		case dpscalc.DragonWarhammer:
			defenceReductions.Dwh += statDrain.Value
		case dpscalc.ElderMaul:
			defenceReductions.ElderMaul += statDrain.Value
		}
	}

	return defenceReductions
}

func buildLoadout(inputGearSetup dpscalc.InputGearSetup) Loadout {
	gear := inputGearSetup.GearSetup.Gear
	eq := Equipment{
		Ammo:   itemId(gear[dpscalc.Ammo]),
		Body:   itemId(gear[dpscalc.Body]),
		Cape:   itemId(gear[dpscalc.Cape]),
		Feet:   itemId(gear[dpscalc.Feet]),
		Hands:  itemId(gear[dpscalc.Hands]),
		Head:   itemId(gear[dpscalc.Head]),
		Legs:   itemId(gear[dpscalc.Legs]),
		Neck:   itemId(gear[dpscalc.Neck]),
		Ring:   itemId(gear[dpscalc.Ring]),
		Shield: itemId(gear[dpscalc.Shield]),
		Weapon: itemId(gear[dpscalc.Weapon]),
	}

	s := inputGearSetup.GearSetupSettings.CombatStats
	skills := getSkillsFromCombatStats(s)
	skills.Mining = inputGearSetup.GearSetup.MiningLevel

	potions := inputGearSetup.GearSetupSettings.PotionBoosts
	buffs := Buffs{
		Potions:       buildPotions(potions),
		InWilderness:  inputGearSetup.GearSetup.IsInWilderness,
		KandarinDiary: inputGearSetup.GearSetup.IsKandarinDiary,
		OnSlayerTask:  inputGearSetup.GearSetup.IsOnSlayerTask,
	}

	cmbtStyle := dpscalc.ParseCombatStyle(inputGearSetup.GearSetup.AttackStyle)
	styleName := strings.Split(inputGearSetup.GearSetup.AttackStyle, " ")[0]
	style := Style{
		Name:   styleName,
		Stance: string(cmbtStyle.CombatStyleStance),
		Type:   strings.ToLower(string(cmbtStyle.CombatStyleType)),
	}

	statBoost := dpscalc.GetPotionBoostStats(s, potions)
	return Loadout{
		Name:      inputGearSetup.GearSetup.Name,
		Style:     style,
		Skills:    skills,
		Boosts:    getSkillsFromCombatStats(statBoost),
		Equipment: eq,
		Prayers:   buildPrayers(inputGearSetup.GearSetup),
		Buffs:     buffs,
		Spell:     Spell{Name: inputGearSetup.GearSetup.Spell},
	}
}

func buildPotions(potionBoosts []dpscalc.PotionBoost) []int {
	potions := make([]int, 0)
	for _, potion := range potionBoosts {
		if potionId, ok := potionsBoostId[potion]; ok {
			potions = append(potions, potionId)
		}
	}
	return potions
}

func buildPrayers(gearSetup dpscalc.GearSetup) []int {
	prayers := make([]int, 0)
	for _, prayer := range gearSetup.Prayers {
		if prayerId, ok := prayersId[prayer]; ok {
			prayers = append(prayers, prayerId)
		}
	}
	return prayers
}

func getSkillsFromCombatStats(stats dpscalc.CombatStats) Skills {
	return Skills{
		Atk:    stats.Attack,
		Def:    stats.Defence,
		HP:     stats.Hitpoints,
		Magic:  stats.Magic,
		Mining: 99,
		Prayer: 99,
		Ranged: stats.Ranged,
		Str:    stats.Strength,
	}
}
