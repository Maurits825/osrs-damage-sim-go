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

func (dist *HitDistribution) Clone() HitDistribution {
	newDist := HitDistribution{make([]WeightedHit, len(dist.Hits))}
	for i, hit := range dist.Hits {
		hitsplats := make([]int, len(hit.Hitsplats))
		copy(hitsplats, hit.Hitsplats)
		newDist.Hits[i] = WeightedHit{hit.Probability, hitsplats}
	}
	return newDist
}

func (dist *HitDistribution) AddWeightedHit(probability float64, hitsplats []int) {
	dist.Hits = append(dist.Hits, WeightedHit{Probability: probability, Hitsplats: hitsplats})
}

func (dist *HitDistribution) ScaleProbability(factor float64) {
	for i := range dist.Hits {
		dist.Hits[i].scale(factor)
	}
}

func (dist *HitDistribution) ScaleDamage(factor float64, divisor float64) {
	for i := range dist.Hits {
		for j, hitsplat := range dist.Hits[i].Hitsplats {
			dist.Hits[i].Hitsplats[j] = int(float64(hitsplat) * factor / divisor)
		}
	}
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
func (dist *HitDistribution) flatten() []float64 {
	flat := make([]float64, dist.getMaxHit()+1)
	for _, weightedHit := range dist.Hits {
		flat[weightedHit.getSum()] += weightedHit.Probability
	}
	return flat
}

func (dist *HitDistribution) cappedReroll(limit int, rollmax int, offset int) {
	newHits := make([]WeightedHit, 0)
	rerollHitsplats := getRerollHitsplats(rollmax, offset)

	for _, weightedHit := range dist.Hits {
		expandedHitsplats := make([][]int, 0)
		for _, hitsplat := range weightedHit.Hitsplats {
			if hitsplat <= limit {
				expandedHitsplats = append(expandedHitsplats, []int{hitsplat})
			} else {
				expandedHitsplats = append(expandedHitsplats, rerollHitsplats)
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

func (dist *HitDistribution) linearMin(maximum, offset int) {
	newHits := make([]WeightedHit, 0)
	for _, weightedHit := range dist.Hits {
		expandedHitsplats := make([][]int, 0)
		for _, hitsplat := range weightedHit.Hitsplats {
			minHitsplats := getMinHitsplats(hitsplat, maximum, offset)
			expandedHitsplats = append(expandedHitsplats, minHitsplats)
		}

		product := cross(expandedHitsplats)
		probability := weightedHit.Probability / float64(len(product))
		for _, expandedHitsplat := range product {
			newHits = append(newHits, WeightedHit{Probability: probability, Hitsplats: expandedHitsplat})
		}
	}
	dist.Hits = newHits
}

func getMinHitsplats(hit, maximum, offset int) []int {
	hitsplats := make([]int, maximum+1)
	for i := 0; i <= maximum; i++ {
		hitsplats[i] = min(hit, i+offset)
	}

	return hitsplats
}

func getRerollHitsplats(rollmax, offset int) []int {
	hitsplats := make([]int, rollmax+1)
	for i := 0; i <= rollmax; i++ {
		hitsplats[i] = i + offset
	}

	return hitsplats
}

func cross(values [][]int) [][]int {
	totalValues := len(values)
	if totalValues == 0 {
		return [][]int{{}}
	}

	lengths := make([]int, totalValues)
	totalProducts := 1
	for i := range values {
		length := len(values[i])
		lengths[i] = length
		totalProducts *= length
	}

	product := make([][]int, 0, totalProducts)
	lastValueIndex := totalValues - 1
	indices := make([]int, totalValues)

	for {
		//add the element based on the indices
		element := make([]int, len(values))
		for i, v := range indices {
			element[i] = values[i][v]
		}
		product = append(product, element)

		//increment last index and handle roll over
		i := lastValueIndex
		indices[i] += 1
		for indices[i] == lengths[i] {
			//i==0 mean all indices have rolled over, cross is done
			if i == 0 {
				return product
			}

			//index needs to roll over
			indices[i] = 0
			i -= 1
			indices[i] += 1
		}
	}
}
