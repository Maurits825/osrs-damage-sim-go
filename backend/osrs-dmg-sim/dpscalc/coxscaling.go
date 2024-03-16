package dpscalc

import (
	"math"
	"slices"
	"strconv"
)

var OlmHeadIds = []int{
	7551, // reg
	7554, // cm
}

var OlmMeleeHandIds = []int{
	7552, // reg
	7555, // cm
}

var OlmMageHandIds = []int{
	7550, // reg
	7553, // cm
}

var OlmIds []int = slices.Concat(OlmHeadIds, OlmMeleeHandIds, OlmMageHandIds)

var ScavanegerBeastIds = []int{
	7548, 7549,
}

var GuardianIds = []int{
	7569, 7571, // reg
	7570, 7572, // cm
}

var GlowingCrystalIds = []int{
	7568,
}

var TektonIds = []int{
	7540, 7543, // reg
	7544, 7545, // cm
}

var AbyssalPortalIds = []int{
	7533,
}

// all equations taken from https://github.com/weirdgloop/osrs-dps-calc/blob/staging/src/lib/scaling/ChambersOfXeric.ts
// TODO using float64 for everything...
func (npc *npc) applyCoxScaling(globalSettings *GlobalSettings) {
	if !npc.isXerician {
		return
	}

	coxScaling := globalSettings.CoxScaling
	ps := float64(globalSettings.TeamSize)
	cmb := float64(coxScaling.PartyMaxCombatLevel)
	npcId, _ := strconv.Atoi(globalSettings.Npc.Id)

	sqrtFloor := func(v float64) float64 {
		return math.Floor(math.Sqrt(v))
	}

	if slices.Contains(OlmIds, npcId) {
		olmHp := func() int {
			headMult := 300.0
			if slices.Contains(OlmHeadIds, npcId) {
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

		npc.baseCombatStats.Hitpoints = olmHp()
		npc.baseCombatStats.Attack = olmOffence(float64(npc.baseCombatStats.Attack))
		npc.baseCombatStats.Strength = olmOffence(float64(npc.baseCombatStats.Strength))
		npc.baseCombatStats.Ranged = olmOffence(float64(npc.baseCombatStats.Ranged))
		npc.baseCombatStats.Magic = olmOffence(float64(npc.baseCombatStats.Magic))
		npc.baseCombatStats.Defence = olmDefence(float64(npc.baseCombatStats.Defence))
		return
	}

	scaleHp := func(base int) int {
		if slices.Contains(ScavanegerBeastIds, npcId) {
			return base
		}
		baseHp := npc.baseCombatStats.Hitpoints
		if slices.Contains(GuardianIds, npcId) {
			baseHp = 151 + coxScaling.PartyAvgMiningLevel
		}
		cmMult := 2.0
		if coxScaling.IsChallengeMode && !slices.Contains(GlowingCrystalIds, npcId) {
			cmMult = 3.0
		}
		return int(math.Floor(float64(baseHp)*cmb/126)*(math.Floor(ps/2)+1)*cmMult) / 2
	}

	hp := float64(coxScaling.PartyMaxHpLevel)
	scaleDefence := func(base int) int {
		f := 2.0
		if slices.Contains(TektonIds, npcId) {
			f = 5.0
		}
		f2 := f
		if coxScaling.IsChallengeMode && !slices.Contains(GlowingCrystalIds, npcId) {
			f2 = f + 1
		}
		return int(math.Floor(math.Floor(math.Floor(float64(base)*(math.Floor(hp*4/9)+55)/99)*(sqrtFloor(ps-1)+math.Floor((ps-1)*7/10)+100)/100) * (f2) / f))
	}

	scaleOffence := func(base int) int {
		if slices.Contains(AbyssalPortalIds, npcId) {
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
		if slices.Contains(TektonIds, npcId) {
			f = 5.0
		}
		//TODO this is pretty much scaleOffence(base, f)
		if slices.Contains(AbyssalPortalIds, npcId) {
			return scaleDefence(base)
		}
		f2 := f
		if coxScaling.IsChallengeMode {
			f2 = f + 1
		}
		return int(math.Floor(math.Floor(math.Floor(float64(base)*(math.Floor(hp*4/9)+55)/99)*(sqrtFloor(ps-1)*7+(ps-1)+100)/100) * (f2) / f))
	}

	npc.baseCombatStats.Hitpoints = scaleHp(npc.baseCombatStats.Hitpoints)
	npc.baseCombatStats.Attack = scaleOffence(npc.baseCombatStats.Attack)
	npc.baseCombatStats.Strength = scaleOffence(npc.baseCombatStats.Strength)
	npc.baseCombatStats.Ranged = scaleOffence(npc.baseCombatStats.Ranged)
	npc.baseCombatStats.Magic = scaleMagic(npc.baseCombatStats.Magic)
	npc.baseCombatStats.Defence = scaleDefence(npc.baseCombatStats.Defence)
}
