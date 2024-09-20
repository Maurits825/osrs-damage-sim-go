package attackdist

//hit distribution of one roll, for scythe this would be one of the 3 hitsplats
type HitDistribution struct {
	Hits []WeightedHit
}

func GetLinearHitDistribution(accuracy float32, minimum int, maximum int) *HitDistribution {
	dist := &HitDistribution{make([]WeightedHit, 2+maximum-minimum)}
	hitProbability := accuracy / (float32(maximum - minimum + 1))

	for i := minimum; i <= maximum; i++ {
		dist.Hits[1+i-minimum] = WeightedHit{Probability: hitProbability, Hitsplats: []int{(max(1, i))}}
	}

	//also add miss hit
	dist.Hits[0] = WeightedHit{Probability: 1 - accuracy, Hitsplats: []int{0}}

	return dist
}

func GetMultiHitOneRollHitDistribution(accuracy float32, minimum int, maximum int, hitsplatCount int) *HitDistribution {
	hits := make([]int, maximum-minimum+1)
	for i := minimum; i <= maximum; i++ {
		hits[i] = i
	}

	hitsplats := make([][]int, hitsplatCount)
	for i := range hitsplatCount {
		hitsplats[i] = hits

	}
	product := cross(hitsplats) //TODO we modify cross to get 0->1 roll?

	dist := &HitDistribution{make([]WeightedHit, len(product))}
	probability := accuracy / float32(len(product))
	for i, expandedHitsplat := range product {
		//TODO otherwise we have to go through the hitsplats and max(1, hit) on them?
		dist.Hits[i] = WeightedHit{Probability: probability, Hitsplats: expandedHitsplat}
	}

	//also add miss hit
	dist.Hits = append(dist.Hits, WeightedHit{Probability: 1 - accuracy, Hitsplats: make([]int, hitsplatCount)})

	return dist
}

func (dist *HitDistribution) Clone() HitDistribution {
	newDist := HitDistribution{make([]WeightedHit, len(dist.Hits))}
	for i, hit := range dist.Hits {
		hitsplats := make([]int, len(hit.Hitsplats))
		copy(hitsplats, hit.Hitsplats)
		newDist.Hits[i] = WeightedHit{Probability: hit.Probability, Hitsplats: hitsplats}
	}
	return newDist
}

func (dist *HitDistribution) AddWeightedHit(probability float32, hitsplats []int) {
	dist.Hits = append(dist.Hits, WeightedHit{Probability: probability, Hitsplats: hitsplats})
}

func (dist *HitDistribution) ScaleProbability(factor float32) {
	for i := range dist.Hits {
		dist.Hits[i].scale(factor)
	}
}

func (dist *HitDistribution) ScaleDamage(factor float32, divisor float32) {
	for i := range dist.Hits {
		for j, hitsplat := range dist.Hits[i].Hitsplats {
			dist.Hits[i].Hitsplats[j] = int(float32(hitsplat) * factor / divisor)
		}
	}
}

func (dist *HitDistribution) MinMaxCap(minHit, maxHit int) {
	for i := range dist.Hits {
		for j, hitsplat := range dist.Hits[i].Hitsplats {
			dist.Hits[i].Hitsplats[j] = min(max(hitsplat, minHit), maxHit)
		}
	}
}

func (dist *HitDistribution) getExpectedHit() float32 {
	expectedHit := float32(0.0)
	for i := range dist.Hits {
		expectedHit += dist.Hits[i].getExpectedHit()
	}
	return expectedHit
}

func (dist *HitDistribution) getMaxHit() int {
	maxHit := 0
	for i := range dist.Hits {
		hit := dist.Hits[i].getSum()
		if hit > maxHit {
			maxHit = hit
		}
	}
	return maxHit
}

//index is the hitspat sum
func (dist *HitDistribution) flatten() []float32 {
	flat := make([]float32, dist.getMaxHit()+1)
	for i := range dist.Hits {
		hit := &dist.Hits[i]
		flat[hit.getSum()] += hit.Probability
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
		probability := weightedHit.Probability / float32(len(product))
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

		//TODO this is a very big array on dclaw spec verzik
		//0-10 hits -> 11hitsplats, 11^4=14k
		//times ~200 for each hitsplats -> 2.8m size array
		product := cross(expandedHitsplats)
		probability := weightedHit.Probability / float32(len(product))
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
