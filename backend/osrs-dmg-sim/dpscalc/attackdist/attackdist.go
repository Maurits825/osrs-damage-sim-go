package attackdist

//attack distribution of all hit distributions, most weapons just have one dist
//scythe would have 3 dists
type AttackDistribution struct {
	Distributions []*HitDistribution
}

func NewSingleAttackDistribution(distributions *HitDistribution) *AttackDistribution {
	return &AttackDistribution{Distributions: []*HitDistribution{distributions}}
}

func NewMultiAttackDistribution(distributions []*HitDistribution) *AttackDistribution {
	return &AttackDistribution{Distributions: distributions}
}

func (attackDist *AttackDistribution) SetSingleAttackDistribution(dist *HitDistribution) {
	attackDist.Distributions = []*HitDistribution{dist}
}

func (attackDist *AttackDistribution) GetExpectedHit() float32 {
	expectedHit := float32(0.0)
	for i := range attackDist.Distributions {
		expectedHit += attackDist.Distributions[i].getExpectedHit()
	}
	return expectedHit
}

func (attackDist *AttackDistribution) GetMaxHitsplats() []int {
	maxHits := make([]int, len(attackDist.Distributions))
	for i := range attackDist.Distributions {
		maxHits[i] = attackDist.Distributions[i].getMaxHit()
	}
	return maxHits
}

func (attackDist *AttackDistribution) GetFlatHitDistribution() []float32 {
	//first get max hit of all distributions, to know the range of dist list
	maxHit := 0
	for i := range attackDist.Distributions {
		maxHit += attackDist.Distributions[i].getMaxHit()
	}

	flatHitDist := make([]float32, maxHit+1)
	flatHitDist[0] = 1.0

	for i := range attackDist.Distributions {
		dist := attackDist.Distributions[i]
		distCombined := make([]float32, maxHit+1)

		flat := dist.flatten()
		//iterate over current hit dist
		for hit1, prob1 := range flatHitDist {
			if prob1 == 0 {
				continue
			}

			for hit2, prob2 := range flat {
				//skip 0 probability hits
				if prob1 == 0 && prob2 == 0 {
					continue
				}
				//add up new probability
				distCombined[hit1+hit2] += prob1 * prob2
			}
		}

		flatHitDist = distCombined
	}

	return flatHitDist
}

func (attackDist *AttackDistribution) ScaleDamage(factor float32, divisor float32) {
	for i := range attackDist.Distributions {
		attackDist.Distributions[i].ScaleDamage(factor, divisor)
	}
}

func (attackDist *AttackDistribution) ScaleProbability(factor float32) {
	for i := range attackDist.Distributions {
		attackDist.Distributions[i].ScaleProbability(factor)
	}
}

func (attackDist *AttackDistribution) CappedReroll(limit int, rollmax int, offset int) {
	for i := range attackDist.Distributions {
		attackDist.Distributions[i].cappedReroll(limit, rollmax, offset)
	}
}

func (attackDist *AttackDistribution) LinearMinTransformer(maximum, offset int) {
	for i := range attackDist.Distributions {
		attackDist.Distributions[i].linearMin(maximum, offset)
	}
}
