package attackdist

//hit distribution of one roll, for scythe this would be one of the 3 hitsplats
type HitDistribution struct {
	Hits []WeightedHit
}

func GetLinearHitDistribution(accuracy float64, minimum int, maximum int) *HitDistribution {
	dist := &HitDistribution{make([]WeightedHit, 0)}
	hitProbability := accuracy / (float64(maximum - minimum + 1))

	for i := minimum; i <= maximum; i++ {
		dist.Hits = append(dist.Hits, WeightedHit{hitProbability, []int{(i)}})
	}

	//also add miss hit
	dist.Hits = append(dist.Hits, WeightedHit{1 - accuracy, []int{0}})

	return dist
}

func (dist *HitDistribution) AddWeightedHit(probability float64, hitsplats []int) {
	dist.Hits = append(dist.Hits, WeightedHit{Probability: probability, Hitsplats: hitsplats})
}

func (dist *HitDistribution) getExpectedHit() float64 {
	expectedHit := 0.0
	for _, weightedHit := range dist.Hits {
		expectedHit += weightedHit.getExpectedHit()
	}
	return expectedHit
}

func (dist *HitDistribution) getMaxHit() int {
	maxHit := 0
	for _, weightedHit := range dist.Hits {
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
	for _, weightedHit := range dist.Hits {
		flat[weightedHit.getSum()] += weightedHit.Probability
	}
	return flat
}

func (dist *HitDistribution) scaleDamage(factor float64, divisor float64) {
	for i := range dist.Hits {
		for j, hitsplat := range dist.Hits[i].Hitsplats {
			dist.Hits[i].Hitsplats[j] = int(float64(hitsplat) * factor / divisor)
		}
	}
}

func (dist *HitDistribution) ScaleProbability(factor float64) {
	for i := range dist.Hits {
		dist.Hits[i].scale(factor)
	}
}

func (dist *HitDistribution) cappedReroll(limit int, rollmax int, offset int) {
	newHits := make([]WeightedHit, 0)
	for _, weightedHit := range dist.Hits {
		expandedHitsplats := make([][]int, 0)
		for _, hitsplat := range weightedHit.Hitsplats {
			if hitsplat <= limit {
				expandedHitsplats = append(expandedHitsplats, []int{hitsplat})
			} else {
				expandedHitsplats = append(expandedHitsplats, expandHitsplat(rollmax, offset))
			}
		}

		product := cross(expandedHitsplats)
		probability := weightedHit.Probability / float64(len(product))
		for _, expandedHitsplat := range product {
			newHits = append(newHits, WeightedHit{Probability: probability, Hitsplats: expandedHitsplat})
		}
	}
	dist.Hits = newHits
}

func expandHitsplat(rollmax, offset int) []int {
	expandedHitsplat := make([]int, 0)
	for i := 0; i <= rollmax; i++ {
		expandedHitsplat = append(expandedHitsplat, i+offset)
	}

	return expandedHitsplat
}

func cross(expandedHitsplats [][]int) [][]int {
	product := make([][]int, 0)
	lengths := make([]int, 0)
	for _, expandedHitsplat := range expandedHitsplats {
		lengths = append(lengths, len(expandedHitsplat))
	}
	j := len(expandedHitsplats) - 1
	index := make([]int, j+1)

	if j < 0 {
		return product
	}

	for {
		element := make([]int, len(expandedHitsplats))
		for i, x := range index {
			element[i] = expandedHitsplats[i][x]
		}
		product = append(product, element)
		x := j

		index[x] += 1
		for index[x] == lengths[x] {
			if x == 0 {
				return product
			}

			index[x] = 0
			x -= 1
			index[x] += 1
		}
	}
}
