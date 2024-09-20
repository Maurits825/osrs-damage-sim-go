package attackdist

type WeightedHit struct {
	Probability float32
	//array of Hitsplats is for multiple hits with same roll like karils (not scy)
	Hitsplats []int
}

func (hit *WeightedHit) getExpectedHit() float32 {
	hitSum := 0
	for _, hit := range hit.Hitsplats {
		hitSum += hit
	}
	return hit.Probability * float32(hitSum)
}

func (hit *WeightedHit) getSum() int {
	sumHit := 0
	for _, hit := range hit.Hitsplats {
		sumHit += hit
	}
	return sumHit
}

func (hit *WeightedHit) scale(factor float32) {
	hit.Probability *= factor
}
