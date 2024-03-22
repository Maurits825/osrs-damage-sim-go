package attackdist

import (
	"math"
	"testing"
)

// TODO common test utils?
var tolerance = float64(0.0000001)

func isFloatEqual(a, b, t float64) bool {
	if a == b {
		return true
	}
	if d := math.Abs(float64(a - b)); d < float64(t) {
		return true
	}
	return false
}

func isProbabilityEqual(actual, expected float64, t *testing.T) {

	if !isFloatEqual(actual, expected, tolerance) {
		t.Fatalf("Expected probability to be %f, got %f", actual, expected)
	}
}

func TestSingleGetHitDistribution(t *testing.T) {
	accuracy := 0.7
	minimum := 0
	maximum := 10
	hitProbability := accuracy / (float64(maximum - minimum + 1))

	hitDist := GetLinearHitDistribution(accuracy, minimum, maximum)
	attackDist := NewSingleAttackDistribution(*hitDist)
	flatDist := attackDist.GetFlatHitDistribution()

	expectedZeroProb := (1 - accuracy) + hitProbability
	isProbabilityEqual(flatDist[0], expectedZeroProb*100, t)
	isProbabilityEqual(flatDist[1], hitProbability*100, t)
}

func TestMultiGetHitDistribution(t *testing.T) {
	accuracy := 0.7
	minimum := 0
	maximum := []int{20, 10}
	hitProbability := make([]float64, len(maximum))
	hitDists := make([]HitDistribution, len(maximum))

	for i, m := range maximum {
		hitProbability[i] = accuracy / (float64(m - minimum + 1))
		hitDists[i] = *GetLinearHitDistribution(accuracy, minimum, m)
	}

	attackDist := NewMultiAttackDistribution(hitDists)
	flatDist := attackDist.GetFlatHitDistribution()

	miss := 1 - accuracy

	//zero dmg is two hitsplats of [0, 0] -> miss,miss - miss,hit0 - hit0,miss - hit0,hit0
	expectedZeroProb := (miss * miss) + (miss * hitProbability[1]) + (hitProbability[0] * miss) + (hitProbability[0] * hitProbability[1])
	isProbabilityEqual(flatDist[0], expectedZeroProb*100, t)

	//1 dmg -> miss,hit1 - hit0,hit1 - hit1,miss - hit1,hit0
	expectedZeroProb = (miss * hitProbability[1]) + (hitProbability[0] * hitProbability[1]) + (hitProbability[0] * miss) + (hitProbability[0] * hitProbability[1])
	isProbabilityEqual(flatDist[1], expectedZeroProb*100, t)
}
