package attackdist

import (
	"testing"

	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/testutil"
)

var tolerance = float32(0.00001)

func isProbabilityEqual(actual, expected float32, t *testing.T) {
	if !testutil.IsFloatEqual32(actual, expected, tolerance) {
		t.Fatalf("Expected probability to be %f, got %f", expected, actual)
	}
}

func TestSingleGetHitDistribution(t *testing.T) {
	accuracy := float32(0.7)
	minimum := 0
	maximum := 10
	hitProbability := accuracy / (float32(maximum - minimum + 1))

	hitDist := GetLinearHitDistribution(accuracy, minimum, maximum)
	attackDist := NewSingleAttackDistribution(hitDist)
	flatDist := attackDist.GetFlatHitDistribution()

	expectedZeroProb := (1 - accuracy)
	isProbabilityEqual(flatDist[0], expectedZeroProb, t)
	isProbabilityEqual(flatDist[1], hitProbability*2, t)
}

func TestMultiGetHitDistribution(t *testing.T) {
	accuracy := float32(0.7)
	minimum := 0
	maximum := []int{20, 10}
	hitProbability := make([]float32, len(maximum))
	hitDists := make([]*HitDistribution, len(maximum))

	for i, m := range maximum {
		hitProbability[i] = accuracy / (float32(m - minimum + 1))
		hitDists[i] = GetLinearHitDistribution(accuracy, minimum, m)
	}

	attackDist := NewMultiAttackDistribution(hitDists)
	flatDist := attackDist.GetFlatHitDistribution()

	miss := 1 - accuracy

	//zero dmg is two misses
	expectedZeroProb := (miss * miss)
	isProbabilityEqual(flatDist[0], expectedZeroProb, t)

	//1 dmg -> [miss, hit 0 or 1] - [hit 0 or 1, miss]
	expected1HitProb := (miss * hitProbability[1] * 2) + (hitProbability[0] * 2 * miss)
	isProbabilityEqual(flatDist[1], expected1HitProb, t)
}
