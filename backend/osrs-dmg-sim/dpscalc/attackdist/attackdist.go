package attackdist

//attack distribution of all hit distributions, most weapons just have one dist
//scythe would have 3 dists
type AttackDistribution struct {
	distributions []HitDistribution
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

func (attackDist *AttackDistribution) GetFlatHitDistribution() []float64 {
	//first get max hit of all distributions, to know the range of dist list
	maxHit := 0
	for _, dist := range attackDist.distributions {
		maxHit += dist.GetMaxHit()
	}
	flatHitDist := make([]float64, maxHit+1)

	//start with hit dist of 100% hitting 0
	hitDistMap := map[int]float64{0: 1.0}
	for _, dist := range attackDist.distributions {
		var distMap map[int]float64 = make(map[int]float64)

		flat := dist.flatten()
		//iterate over current hit dist
		for hit1, prob1 := range hitDistMap {
			for hit2, prob2 := range flat {
				//skip 0 probability hits
				if prob1 == 0 && prob2 == 0 {
					continue
				}
				//add up new probability
				distMap[hit1+hit2] += prob1 * prob2
			}
		}

		hitDistMap = distMap
	}

	//flatten map
	for hit, prob := range hitDistMap {
		flatHitDist[hit] = prob * 100
	}

	return flatHitDist
}
