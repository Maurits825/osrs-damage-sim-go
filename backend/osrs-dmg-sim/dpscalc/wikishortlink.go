package dpscalc

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
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
	Potions       int  `json:"potions"`
	InWilderness  bool `json:"inWilderness"`
	KandarinDiary bool `json:"kandarinDiary"`
	OnSlayerTask  bool `json:"onSlayerTask"`
}

type Loadout struct {
	Name string `json:"name"`
	// Style     string    `json:"style"`
	Skills    Skills    `json:"skills"`
	Boosts    Skills    `json:"boosts"`
	Equipment Equipment `json:"equipment"`
	// Prayers   []int     `json:"prayers"`
	Buffs Buffs `json:"buffs"`
	// Spell string `json:"spell"` //TODO spell object
}

type ShortlinkData struct {
	Loadouts []Loadout `json:"loadouts"`
	// Monster  itemId    `json:"monster"`
}

type wikiDpsShortLink struct {
	Data string `json:"data"`
}

const shortLinkEndpoint = "https://tools.runescape.wiki/osrs-dps/shortlink"
const wikiDpsUrl = "https://dps.osrs.wiki"

func CreateWikiDpsShortlink(inputSetup InputSetup) string {
	shortlinkData := buildShortlinkData(inputSetup)
	jsonData, err := json.Marshal(shortlinkData)
	if err != nil {
		fmt.Println("Error marshalling to JSON:", err)
		return ""
	}
	fmt.Println(string(jsonData))

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

func buildShortlinkData(inputSetup InputSetup) ShortlinkData {
	loadouts := make([]Loadout, len(inputSetup.InputGearSetups))
	for i, inputGearSetup := range inputSetup.InputGearSetups {
		loadouts[i] = buildLoadout(inputGearSetup)
	}

	// npcId, _ := strconv.Atoi(inputSetup.GlobalSettings.Npc.Id)
	return ShortlinkData{
		Loadouts: loadouts,
		// Monster:  itemId{Id: npcId},
	}
}

func buildLoadout(inputGearSetup InputGearSetup) Loadout {
	gear := inputGearSetup.GearSetup.Gear
	eq := Equipment{
		Ammo:   itemId(gear[Ammo]),
		Body:   itemId(gear[Body]),
		Cape:   itemId(gear[Cape]),
		Feet:   itemId(gear[Feet]),
		Hands:  itemId(gear[Hands]),
		Head:   itemId(gear[Head]),
		Legs:   itemId(gear[Legs]),
		Neck:   itemId(gear[Neck]),
		Ring:   itemId(gear[Ring]),
		Shield: itemId(gear[Shield]),
		Weapon: itemId(gear[Weapon]),
	}

	s := inputGearSetup.GearSetupSettings.CombatStats
	skills := Skills{
		Atk:    s.Attack,
		Def:    s.Defence,
		HP:     s.Hitpoints,
		Magic:  s.Magic,
		Mining: inputGearSetup.GearSetup.MiningLevel,
		Prayer: 99,
		Ranged: s.Ranged,
		Str:    s.Strength,
	}

	buffs := Buffs{
		// Potions: ,//TODO convert to int??
		InWilderness:  inputGearSetup.GearSetup.IsInWilderness,
		KandarinDiary: inputGearSetup.GearSetup.IsKandarinDiary,
		OnSlayerTask:  inputGearSetup.GearSetup.IsOnSlayerTask,
	}

	return Loadout{
		Name: inputGearSetup.GearSetup.Name,
		// Style:  inputGearSetup.GearSetup.AttackStyle,
		Skills: skills,
		// Boosts: , needed?
		Equipment: eq,
		// Prayers: inputGearSetup.GearSetup.Prayers, //TODO convert to int????...
		Buffs: buffs,
	}
}
