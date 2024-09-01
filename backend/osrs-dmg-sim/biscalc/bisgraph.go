package biscalc

import (
	"strconv"

	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/dpscalc"
	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/wikidata"
)

type ItemNode struct {
	ids  []int
	next []*ItemNode
}

type SlotBisGraph map[dpscalc.GearSlot][]*ItemNode
type StyleBisGraph map[dpscalc.CombatStyleType]SlotBisGraph

var bisGraphs StyleBisGraph

func getStyleBisGraph(graphs wikidata.BisGraphs) StyleBisGraph {
	styleMap := map[string]dpscalc.CombatStyleType{
		"1": dpscalc.Stab,
		"2": dpscalc.Slash,
		"3": dpscalc.Crush,
		"4": dpscalc.Ranged,
		"5": dpscalc.Magic,
	}

	styleBisGraph := make(StyleBisGraph)
	for styleString, style := range styleMap {
		slotBisGraph := make(SlotBisGraph)
		for _, gearSlot := range allGearSlots {
			slotBisGraph[gearSlot] = getSlotBisGraph(graphs[styleString][strconv.Itoa(int(gearSlot))])
		}
		styleBisGraph[style] = slotBisGraph
	}

	return styleBisGraph
}

func getSlotBisGraph(bisSlotNode wikidata.BisSlotGraph) []*ItemNode {
	var createItemNode func(item wikidata.BisItem) *ItemNode
	createItemNode = func(item wikidata.BisItem) *ItemNode {
		var ids = make([]int, len(item.Ids))
		for i, id := range item.Ids {
			ids[i], _ = strconv.Atoi(id)
		}

		if len(item.Next) == 0 {
			return &ItemNode{ids: ids, next: []*ItemNode{}}
		}

		var nextNodes = make([]*ItemNode, len(item.Next))
		for i, next := range item.Next {
			nextNodes[i] = createItemNode(bisSlotNode.Nodes[next])
		}

		return &ItemNode{ids: ids, next: nextNodes}
	}

	var rootNodes = make([]*ItemNode, len(bisSlotNode.Roots))
	for i, rootId := range bisSlotNode.Roots {
		rootNodes[i] = createItemNode(bisSlotNode.Nodes[rootId])
	}

	return rootNodes
}
