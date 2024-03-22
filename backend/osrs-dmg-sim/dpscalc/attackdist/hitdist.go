package attackdist

//hit distribution of one roll, for scythe this would be one of the 3 hitsplats
type HitDistribution struct {
	hits []WeightedHit
}

func (dist *HitDistribution) GetExpectedHit() float64 {
	expectedHit := 0.0
	for _, weightedHit := range dist.hits {
		expectedHit += weightedHit.GetExpectedHit()
	}
	return expectedHit
}

func (dist *HitDistribution) GetMaxHit() int {
	maxHit := 0
	for _, weightedHit := range dist.hits {
		hit := weightedHit.GetSum()
		if hit > maxHit {
			maxHit = hit
		}
	}
	return maxHit
}

//index is the hitspat sum
//TODO return map? after writing tests
func (dist *HitDistribution) flatten() []float64 {
	flat := make([]float64, dist.GetMaxHit()+1)
	for _, weightedHit := range dist.hits {
		flat[weightedHit.GetSum()] += weightedHit.probability
	}
	return flat
}
