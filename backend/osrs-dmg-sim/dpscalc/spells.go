package dpscalc

import (
	"strings"

	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/wikidata"
)

type elementalType string

const (
	NoneElement  elementalType = "no"
	WaterElement elementalType = "water"
	FireElement  elementalType = "fire"
	EarthElement elementalType = "earth"
	AirElement   elementalType = "air"
)

type spellBook string

const (
	standardSpellBook spellBook = "standard"
	ancientSpellBook  spellBook = "ancient"
	lunarSpellBook    spellBook = "lunar"
	arceuusSpellBook  spellBook = "arceuus"
)

type spell struct {
	name          string
	maxHit        int
	spellbook     spellBook
	elementalType elementalType
}

var spells = getSpells()

func getSpells() []spell {
	spellData := wikidata.GetWikiData(wikidata.SpellProvider).([]wikidata.SpellData)

	spells := make([]spell, len(spellData))
	for i, s := range spellData {
		spells[i] = spell{
			name:          s.Name,
			maxHit:        s.MaxHit,
			spellbook:     spellBook(s.SpellBook),
			elementalType: elementalType(s.Element),
		}
	}
	return spells
}

func getSpellByName(name string) spell {
	for _, s := range spells {
		if s.name == name {
			return s
		}
	}
	return spell{}
}

func getSpellMaxHit(spell spell, magicLevel int) int {
	if spell.elementalType == NoneElement {
		return spell.maxHit
	}

	spellClass := strings.Split(spell.name, " ")[1]
	switch spellClass {
	case "Strike":
		if magicLevel >= 13 {
			return getSpellByName("Fire " + spellClass).maxHit
		}
		if magicLevel >= 9 {
			return getSpellByName("Earth " + spellClass).maxHit
		}
		if magicLevel >= 5 {
			return getSpellByName("Water " + spellClass).maxHit
		}
		return getSpellByName("Wind " + spellClass).maxHit

	case "Bolt":
		if magicLevel >= 35 {
			return getSpellByName("Fire " + spellClass).maxHit
		}
		if magicLevel >= 29 {
			return getSpellByName("Earth " + spellClass).maxHit
		}
		if magicLevel >= 23 {
			return getSpellByName("Water " + spellClass).maxHit
		}
		return getSpellByName("Wind " + spellClass).maxHit

	case "Blast":
		if magicLevel >= 59 {
			return getSpellByName("Fire " + spellClass).maxHit
		}
		if magicLevel >= 53 {
			return getSpellByName("Earth " + spellClass).maxHit
		}
		if magicLevel >= 47 {
			return getSpellByName("Water " + spellClass).maxHit
		}
		return getSpellByName("Wind " + spellClass).maxHit

	case "Wave":
		if magicLevel >= 75 {
			return getSpellByName("Fire " + spellClass).maxHit
		}
		if magicLevel >= 70 {
			return getSpellByName("Earth " + spellClass).maxHit
		}
		if magicLevel >= 65 {
			return getSpellByName("Water " + spellClass).maxHit
		}
		return getSpellByName("Wind " + spellClass).maxHit

	case "Surge":
		if magicLevel >= 95 {
			return getSpellByName("Fire " + spellClass).maxHit
		}
		if magicLevel >= 90 {
			return getSpellByName("Earth " + spellClass).maxHit
		}
		if magicLevel >= 85 {
			return getSpellByName("Water " + spellClass).maxHit
		}
		return getSpellByName("Wind " + spellClass).maxHit

	default:
		return 0
	}
}
