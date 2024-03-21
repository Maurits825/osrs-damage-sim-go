package attackdist

//attack distribution of all hit distributions, most weapons just have one dist
//scythe would have 3 dists
type AttackDistribution struct {
	distributions []HitDistribution
}

//hit distribution of one roll, for scythe this would be one of the 3 hitsplats
type HitDistribution struct {
	hits []WeightedHit
}

func NewSingleAttackDistribution(distributions HitDistribution) *AttackDistribution {
	return &AttackDistribution{distributions: []HitDistribution{distributions}}
}

func NewMultiAttackDistribution(distributions []HitDistribution) *AttackDistribution {
	return &AttackDistribution{distributions: distributions}
}

func GetLinearHitDistribution(accuracy float64, minimum int, maximum int) *HitDistribution {
	dist := &HitDistribution{make([]WeightedHit, 0)}
	hitProbability := accuracy / (float64(maximum - minimum + 1))

	for i := minimum; i <= maximum; i++ {
		dist.hits = append(dist.hits, WeightedHit{hitProbability, []int{(i)}})
	}

	//also add miss hit
	dist.hits = append(dist.hits, WeightedHit{1 - accuracy, []int{0}})

	return dist
}

func (attackDist *AttackDistribution) GetExpectedHit() float64 {
	expectedHit := 0.0
	for _, dist := range attackDist.distributions {
		expectedHit += dist.GetExpectedHit()
	}
	return expectedHit
}

func (dist *HitDistribution) GetExpectedHit() float64 {
	expectedHit := 0.0
	for _, weightedHit := range dist.hits {
		expectedHit += weightedHit.GetExpectedHit()
	}
	return expectedHit
}
