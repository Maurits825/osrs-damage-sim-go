package attackdist

import (
	"reflect"
	"testing"
)

func checkProbabilities(t *testing.T, flat []float64, probs map[int]float64) {
	for index, prob := range probs {
		if !isFloatEqual(flat[index], prob, tolerance) {
			t.Errorf("Expected %v probability %f, got %f", index, prob, flat[index])
		}
	}
}

func TestCappedReroll1(t *testing.T) {
	hits := []WeightedHit{
		{Probability: 0.2, Hitsplats: []int{5}},
		{Probability: 0.2, Hitsplats: []int{10, 9}},
		{Probability: 0.2, Hitsplats: []int{15}},
		{Probability: 0.2, Hitsplats: []int{20, 5}},
		{Probability: 0.2, Hitsplats: []int{20, 20}},
	}
	hitDistribution := HitDistribution{hits}

	//if >10 -> reroll (9, 10)
	limit := 10
	rollmax := 1
	offset := 9
	hitDistribution.cappedReroll(limit, rollmax, offset)

	flat := hitDistribution.flatten()

	rerollProb := 1 / float64(rollmax+1)
	probs := map[int]float64{
		0:  0.0,
		5:  0.2,
		10: 0.2 * rerollProb,
		//19 --> 10,9 and 9,10 - 10,9
		19: 0.2 + 2*(0.2*rerollProb*rerollProb),
		//20 --> 10,10
		20: 0.2 * rerollProb * rerollProb,
	}

	checkProbabilities(t, flat, probs)
}

func TestCappedReroll2(t *testing.T) {
	hits := []WeightedHit{
		{Probability: 0.4, Hitsplats: []int{5}},
		{Probability: 0.4, Hitsplats: []int{10, 20, 15}},
		{Probability: 0.2, Hitsplats: []int{15}},
	}
	hitDistribution := HitDistribution{hits}

	//if >5 -> reroll (10 ... 15)
	limit := 5
	rollmax := 5
	offset := 10
	hitDistribution.cappedReroll(limit, rollmax, offset)

	flat := hitDistribution.flatten()

	rerollProb := 1 / float64(rollmax+1)
	probs := map[int]float64{
		0:  0.0,
		5:  0.4,
		10: 0.2 * rerollProb,
		15: 0.2 * rerollProb,
		//30 -> 10,10,10
		30: 0.4 * rerollProb * rerollProb * rerollProb,
		//35 -> 21 ways to sum to 35
		35: 0.4 * rerollProb * rerollProb * rerollProb * 21,
	}

	checkProbabilities(t, flat, probs)
}
func TestCross(t *testing.T) {
	input := [][]int{
		{1, 2, 3},
		{1, 2, 3},
		{1, 2, 3},
	}

	expected := [][]int{
		{1, 1, 1},
		{1, 1, 2},
		{1, 1, 3},
		{1, 2, 1},
		{1, 2, 2},
		{1, 2, 3},
		{1, 3, 1},
		{1, 3, 2},
		{1, 3, 3},
		{2, 1, 1},
		{2, 1, 2},
		{2, 1, 3},
		{2, 2, 1},
		{2, 2, 2},
		{2, 2, 3},
		{2, 3, 1},
		{2, 3, 2},
		{2, 3, 3},
		{3, 1, 1},
		{3, 1, 2},
		{3, 1, 3},
		{3, 2, 1},
		{3, 2, 2},
		{3, 2, 3},
		{3, 3, 1},
		{3, 3, 2},
		{3, 3, 3},
	}

	actual := cross(input)
	if !reflect.DeepEqual(actual, expected) {
		t.Fatalf("Expected %v, got %v", expected, actual)
	}
}

func TestCrossUneven(t *testing.T) {
	input := [][]int{
		{1, 2, 3},
		{1, 2},
		{1},
	}

	expected := [][]int{
		{1, 1, 1},
		{1, 2, 1},
		{2, 1, 1},
		{2, 2, 1},
		{3, 1, 1},
		{3, 2, 1},
	}

	actual := cross(input)
	if !reflect.DeepEqual(actual, expected) {
		t.Fatalf("Expected %v, got %v", expected, actual)
	}
}
