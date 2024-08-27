package biscalc

import (
	"fmt"

	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/wikidata"
)

//new bis calc approach

var allItems map[int]wikidata.ItemData

func init() {
	allItems = wikidata.GetWikiData(wikidata.ItemProvider).(map[int]wikidata.ItemData)
	bisGraph := wikidata.GetWikiData(wikidata.BisGraphProvider).(wikidata.BisGraph)
	fmt.Println(bisGraph["1"]["2"]["1"].Ids)
	//TODO convert bisgraph into some data type???
}
