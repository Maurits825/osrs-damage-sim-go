package attackdist

type WeightedHit struct {
	probability float64
	//array of hitsplats is for multiple hits with same roll like karils (not scy)
	hitsplats []int
}

func (hit *WeightedHit) GetExpectedHit() float64 {
	hitSum := 0
	for _, hit := range hit.hitsplats {
		hitSum += hit
	}

	return hit.probability * float64(hitSum)
}

//TODO other stuff like scale
