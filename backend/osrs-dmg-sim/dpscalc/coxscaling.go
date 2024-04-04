package dpscalc

import (
	"math"
	"slices"
)

var (
	olmHeadIds = []int{
		7551, // reg
		7554, // cm
	}

	olmMeleeHandIds = []int{
		7552, // reg
		7555, // cm
	}

	olmMageHandIds = []int{
		7550, // reg
		7553, // cm
	}

	olmIds []int = slices.Concat(olmHeadIds, olmMeleeHandIds, olmMageHandIds)

	scavengerBeastIds = []int{
		7548, 7549,
	}

	guardianIds = []int{
		7569, 7571, // reg
		7570, 7572, // cm
	}

	glowingCrystalIds = []int{
		7568,
	}

	tektonIds = []int{
		7540, 7543, // reg
		7544, 7545, // cm
	}

	abyssalPortalIds = []int{
		7533,
	}
)

// all equations taken from https://github.com/weirdgloop/osrs-dps-calc/blob/staging/src/lib/scaling/ChambersOfXeric.ts
// TODO using float64 for everything...
func (npc *npc) applyCoxScaling(globalSettings *GlobalSettings) {
	if !npc.IsXerician {
		return
	}

	coxScaling := globalSettings.CoxScaling
	ps := float64(globalSettings.TeamSize)
	cmb := float64(coxScaling.PartyMaxCombatLevel)
	npcId := npc.id

	sqrtFloor := func(v float64) float64 {
		return math.Floor(math.Sqrt(v))
	}

	if slices.Contains(olmIds, npcId) {
		olmHp := func() int {
			headMult := 300.0
			if slices.Contains(olmHeadIds, npcId) {
				headMult = 400.0
			}
			return int(headMult * (ps - math.Floor(ps/8)*3 + 1))
		}
		cmMult := 2.0
		if coxScaling.IsChallengeMode {
			cmMult = 3.0
		}
		olmDefence := func(base float64) int {
			return int(base * (sqrtFloor(ps-1) + math.Floor((ps-1)*7/10) + 100) / 100 * cmMult / 2)
		}
		olmOffence := func(base float64) int {
			return int(base * (sqrtFloor(ps-1)*7 + (ps - 1) + 100) / 100 * cmMult / 2)
		}

		npc.BaseCombatStats.Hitpoints = olmHp()
		npc.BaseCombatStats.Attack = olmOffence(float64(npc.BaseCombatStats.Attack))
		npc.BaseCombatStats.Strength = olmOffence(float64(npc.BaseCombatStats.Strength))
		npc.BaseCombatStats.Ranged = olmOffence(float64(npc.BaseCombatStats.Ranged))
		npc.BaseCombatStats.Magic = olmOffence(float64(npc.BaseCombatStats.Magic))
		npc.BaseCombatStats.Defence = olmDefence(float64(npc.BaseCombatStats.Defence))
		return
	}

	scaleHp := func(base int) int {
		if slices.Contains(scavengerBeastIds, npcId) {
			return base
		}
		baseHp := npc.BaseCombatStats.Hitpoints
		if slices.Contains(guardianIds, npcId) {
			baseHp = 151 + coxScaling.PartyAvgMiningLevel
		}
		cmMult := 2.0
		if coxScaling.IsChallengeMode && !slices.Contains(glowingCrystalIds, npcId) {
			cmMult = 3.0
		}
		return int(math.Floor(float64(baseHp)*cmb/126)*(math.Floor(ps/2)+1)*cmMult) / 2
	}

	hp := float64(coxScaling.PartyMaxHpLevel)
	scaleDefence := func(base int) int {
		f := 2.0
		if slices.Contains(tektonIds, npcId) {
			f = 5.0
		}
		f2 := f
		if coxScaling.IsChallengeMode && !slices.Contains(glowingCrystalIds, npcId) {
			f2 = f + 1
		}
		return int(math.Floor(math.Floor(math.Floor(float64(base)*(math.Floor(hp*4/9)+55)/99)*(sqrtFloor(ps-1)+math.Floor((ps-1)*7/10)+100)/100) * (f2) / f))
	}

	scaleOffence := func(base int) int {
		if slices.Contains(abyssalPortalIds, npcId) {
			return scaleDefence(base)
		}
		f := 2.0
		f2 := f
		if coxScaling.IsChallengeMode {
			f2 = f + 1
		}
		return int(math.Floor(math.Floor(math.Floor(float64(base)*(math.Floor(hp*4/9)+55)/99)*(sqrtFloor(ps-1)*7+(ps-1)+100)/100) * (f2) / f))
	}

	scaleMagic := func(base int) int {
		f := 2.0
		if slices.Contains(tektonIds, npcId) {
			f = 5.0
		}
		//TODO this is pretty much scaleOffence(base, f)
		if slices.Contains(abyssalPortalIds, npcId) {
			return scaleDefence(base)
		}
		f2 := f
		if coxScaling.IsChallengeMode {
			f2 = f + 1
		}
		return int(math.Floor(math.Floor(math.Floor(float64(base)*(math.Floor(hp*4/9)+55)/99)*(sqrtFloor(ps-1)*7+(ps-1)+100)/100) * (f2) / f))
	}

	npc.BaseCombatStats.Hitpoints = scaleHp(npc.BaseCombatStats.Hitpoints)
	npc.BaseCombatStats.Attack = scaleOffence(npc.BaseCombatStats.Attack)
	npc.BaseCombatStats.Strength = scaleOffence(npc.BaseCombatStats.Strength)
	npc.BaseCombatStats.Ranged = scaleOffence(npc.BaseCombatStats.Ranged)
	npc.BaseCombatStats.Magic = scaleMagic(npc.BaseCombatStats.Magic)
	npc.BaseCombatStats.Defence = scaleDefence(npc.BaseCombatStats.Defence)
}
