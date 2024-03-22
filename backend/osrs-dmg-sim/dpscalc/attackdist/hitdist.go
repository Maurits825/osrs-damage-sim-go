package attackdist

//hit distribution of one roll, for scythe this would be one of the 3 hitsplats
type HitDistribution struct {
	hits []WeightedHit
}

func (dist *HitDistribution) AddWeightedHit(probability float64, hitsplats []int) {
	dist.hits = append(dist.hits, WeightedHit{probability: probability, hitsplats: hitsplats})
}

func (dist *HitDistribution) getExpectedHit() float64 {
	expectedHit := 0.0
	for _, weightedHit := range dist.hits {
		expectedHit += weightedHit.getExpectedHit()
	}
	return expectedHit
}

func (dist *HitDistribution) getMaxHit() int {
	maxHit := 0
	for _, weightedHit := range dist.hits {
		hit := weightedHit.getSum()
		if hit > maxHit {
			maxHit = hit
		}
	}
	return maxHit
}

//index is the hitspat sum
//TODO return map? after writing tests
func (dist *HitDistribution) flatten() []float64 {
	flat := make([]float64, dist.getMaxHit()+1)
	for _, weightedHit := range dist.hits {
		flat[weightedHit.getSum()] += weightedHit.probability
	}
	return flat
}

func (dist *HitDistribution) scaleDamage(factor float64, divisor float64) {
	for i := range dist.hits {
		for j, hitsplat := range dist.hits[i].hitsplats {
			dist.hits[i].hitsplats[j] = int(float64(hitsplat) * factor / divisor)
		}
	}
}

func (dist *HitDistribution) scaleProbability(factor float64) {
	for i := range dist.hits {
		dist.hits[i].scale(factor)
	}
}
