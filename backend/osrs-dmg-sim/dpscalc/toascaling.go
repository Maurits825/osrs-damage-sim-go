package dpscalc

import "slices"

//TODO could have zebakId = ... so that in stat drain we can use id check instead of name check
var (
	akkhaIds               = []int{11789, 11790, 11791, 11792, 11793, 11794, 11795, 11796}
	akkhaShadowIds         = []int{11797, 11798, 11799}
	babaIds                = []int{11778, 11779, 11780}
	standardBaboonSmallIds = []int{11709, 11710, 11711}
	standardBaboonLargeIds = []int{11712, 11713, 11714}
	baboonShamanIds        = []int{11715}
	volatileBaboonIds      = []int{11716}
	cursedBaboonIds        = []int{11717}
	baboonThrallIds        = []int{11718}
	apmekenBaboonIds       = slices.Concat(standardBaboonSmallIds, standardBaboonLargeIds, baboonShamanIds, volatileBaboonIds, cursedBaboonIds, baboonThrallIds)
	kephriShieldedIds      = []int{11719}
	kephriUnshieldedIds    = []int{11721}
	kephriOverlordIds      = []int{11724, 11725, 11726}
	zebakIds               = []int{11730, 11732, 11733}
	toaObeliskIds          = []int{11750, 11751, 11752}
	p2WardenIds            = []int{11753, 11754, 11755, 11756, 11757, 11758}
	p3WardenIds            = []int{11761, 11763, 11762, 11764}
	toaCoreIds             = []int{11770, 11771}

	toaPathIds = slices.Concat(akkhaIds, akkhaShadowIds, babaIds, apmekenBaboonIds, kephriShieldedIds, kephriUnshieldedIds, kephriOverlordIds, zebakIds)
	ToaIds     = slices.Concat(toaPathIds, toaObeliskIds, p2WardenIds, toaCoreIds, p3WardenIds)
)

func getToaScalingValues(npcId int) (int, int) {
	if slices.Contains(akkhaIds, npcId) {
		return 40, 10
	}

	if slices.Contains(akkhaShadowIds, npcId) {
		return 14, 5
	}

	if slices.Contains(babaIds, npcId) {
		return 38, 10
	}

	if slices.Contains(standardBaboonSmallIds, npcId) {
		return 4, 1
	}

	if slices.Contains(standardBaboonLargeIds, npcId) {
		return 6, 1
	}

	if slices.Contains(baboonShamanIds, npcId) {
		return 16, 1
	}

	if slices.Contains(volatileBaboonIds, npcId) {
		return 8, 1
	}

	if slices.Contains(cursedBaboonIds, npcId) {
		return 10, 1
	}

	if slices.Contains(baboonThrallIds, npcId) {
		return 2, 1
	}

	if slices.Contains(kephriShieldedIds, npcId) {
		return 15, 10
	}

	if slices.Contains(kephriUnshieldedIds, npcId) {
		return 16, 5
	}

	if slices.Contains(kephriOverlordIds, npcId) {
		return 40, 1
	}

	if slices.Contains(zebakIds, npcId) {
		return 58, 10
	}

	if slices.Contains(toaObeliskIds, npcId) {
		return 26, 10
	}

	if slices.Contains(p2WardenIds, npcId) {
		return 28, 5
	}

	if slices.Contains(toaCoreIds, npcId) {
		return 450, 10
	}

	if slices.Contains(p3WardenIds, npcId) {
		return 88, 10
	}

	// Return default values if the NPC ID is not found
	return 0, 0
}

func (npc *npc) applyToaScaling(globalSettings *GlobalSettings) {
	if !slices.Contains(ToaIds, npc.id) {
		return
	}

	invoFactor := 4 * globalSettings.RaidLevel
	if slices.Contains(toaCoreIds, npc.id) {
		invoFactor = globalSettings.RaidLevel
	}

	pathLevelFactor := 0
	if slices.Contains(toaPathIds, npc.id) {
		pathLevelFactor = min(6, max(0, globalSettings.PathLevel))
		if globalSettings.PathLevel >= 1 {
			pathLevelFactor += 3
			pathLevelFactor += 5 * globalSettings.PathLevel
		}
	}

	partySize := min(8, max(1, globalSettings.TeamSize))
	partyFactor := 0
	if partySize >= 2 {
		partyFactor += 9 * min(2, partySize-1)
	}
	if partySize >= 400 {
		partyFactor += 6 * (partySize - 3)
	}

	base, factor := getToaScalingValues(npc.id)

	newHp := int(base*(1000+invoFactor)*(100+pathLevelFactor)*(10+partyFactor)/(1000*100*10)) * factor

	npc.BaseCombatStats.Hitpoints = newHp
}
