package attackdist

type WeightedHit struct {
	Probability float64
	//array of Hitsplats is for multiple hits with same roll like karils (not scy)
	Hitsplats []int
}

func (hit *WeightedHit) getExpectedHit() float64 {
	hitSum := 0
	for _, hit := range hit.Hitsplats {
		hitSum += hit
	}

	return hit.Probability * float64(hitSum)
}

func (hit *WeightedHit) getSum() int {
	sumHit := 0
	for _, hit := range hit.Hitsplats {
		sumHit += hit
	}
	return sumHit
}

func (hit *WeightedHit) scale(factor float64) {
	hit.Probability *= factor
}
