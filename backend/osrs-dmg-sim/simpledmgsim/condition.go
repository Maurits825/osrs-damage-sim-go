package simpledmgsim

var conditionEvaluator = map[string]func(v1, v2 int) bool{
	"EQUAL":        func(v1, v2 int) bool { return v1 == v2 },
	"GRT_THAN":     func(v1, v2 int) bool { return v1 > v2 },
	"LESS_THAN":    func(v1, v2 int) bool { return v1 < v2 },
	"GRT_EQ_THAN":  func(v1, v2 int) bool { return v1 >= v2 },
	"LESS_EQ_THAN": func(v1, v2 int) bool { return v1 <= v2 },
}

// TODO better way to pass in the vars?
func evaluateConditions(conditions []Condition, npcHitpoints, dmgDealt, attackCount int) bool {
	count := len(conditions)
	if count == 0 {
		return true
	}

	results := make([]bool, count)
	for i, condition := range conditions {
		eval, ok := conditionEvaluator[condition.Comparison]
		if !ok {
			panic("invalid condition comparison: " + condition.Comparison)
		}

		var v1 int
		switch condition.Variable {
		case "NPC_HITPOINTS":
			v1 = npcHitpoints
		case "DMG_DEALT":
			v1 = dmgDealt
		case "ATTACK_COUNT":
			v1 = attackCount
		default:
			panic("invalid condition variable: " + condition.Variable)
		}

		results[i] = eval(v1, condition.Value)
	}

	//TODO still have multi and/or groups that dont really make sense
	result := results[0]
	if count > 1 {
		result = true
		for i := range results[:count-1] {
			switch conditions[i].NextComparison {
			case "AND":
				result = result && (results[i] && results[i+1])
			case "OR":
				result = result && (results[i] || results[i+1])
			default:
				panic("invalid conditon next comparison: " + conditions[i].NextComparison)
			}
		}
	}

	return result
}
