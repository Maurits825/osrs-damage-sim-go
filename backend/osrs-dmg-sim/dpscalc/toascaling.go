package dpscalc

import "slices"

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
	toaIds     = slices.Concat(toaPathIds, toaObeliskIds, p2WardenIds, toaCoreIds, p3WardenIds)
)
