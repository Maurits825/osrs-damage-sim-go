package attackdist

import (
	"errors"
	"math"
	"slices"
)

// hit distribution of one roll, for scythe this would be one of the 3 hitsplats
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

// index is the hitspat sum
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
	rolls := len(dist.Hits[0].Hitsplats) //TODO assume all hits will have same num of rolls
	sumProbs := make([]float32, (maximum+1)*rolls)
	probCache := make(map[int][]float32)

	expandedHitsplats := make([][]int, rolls)
	totalProducts := float32(math.Pow(float64(maximum+1), float64(rolls)))

	for i := range expandedHitsplats {
		expandedHitsplats[i] = make([]int, maximum+1)
	}

	for i := range dist.Hits {
		hitsplats := dist.Hits[i].Hitsplats

		//32bit/4max rolls = 8 bits for each hit, max 255
		slices.Sort(hitsplats)
		hash := 0
		for _, hit := range hitsplats {
			hash |= hit
			hash <<= 8
		}

		if cachedProb, ok := probCache[hash]; ok {
			for i := range cachedProb {
				sumProbs[i] += cachedProb[i]
			}
			continue
		}

		for i, hit := range hitsplats {
			for j := 0; j <= maximum; j++ {
				expandedHitsplats[i][j] = min(hit, j+offset)
			}
		}

		crossIter := crossIterator(expandedHitsplats)
		probability := dist.Hits[i].Probability / totalProducts
		product, err := crossIter()

		cachedProb := make([]float32, (maximum+1)*rolls)
		for ; err == nil; product, err = crossIter() {
			sumHit := 0
			for _, hit := range product {
				sumHit += hit
			}
			sumProbs[sumHit] += probability
			cachedProb[sumHit] += probability
		}
		probCache[hash] = cachedProb
	}

	newH := make([]WeightedHit, 0, len(sumProbs))
	for i := range sumProbs {
		if sumProbs[i] != 0 {
			newH = append(newH, WeightedHit{Probability: sumProbs[i], Hitsplats: []int{i}})
		}
	}

	dist.Hits = newH
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

var errIterEmpty = errors.New("iterator is empty")

func crossIterator(values [][]int) func() ([]int, error) {
	isEmpty := false
	totalValues := len(values)
	lastValueIndex := totalValues - 1

	lengths := make([]int, totalValues)
	indices := make([]int, totalValues)

	for i := range values {
		lengths[i] = len(values[i])
	}

	element := make([]int, totalValues)
	return func() ([]int, error) {
		if isEmpty {
			return nil, errIterEmpty
		}

		//add the element based on the indices
		for i, v := range indices {
			element[i] = values[i][v]
		}

		//increment last index and handle roll over
		i := lastValueIndex
		indices[i] += 1
		for indices[i] == lengths[i] {
			//i==0 mean all indices have rolled over, cross is done
			if i == 0 {
				isEmpty = true
				return element, nil
			}

			//index needs to roll over
			indices[i] = 0
			i -= 1
			indices[i] += 1
		}

		return element, nil
	}
}
