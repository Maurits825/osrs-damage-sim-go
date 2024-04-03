package dpscalc

import (
	"fmt"

	"testing"

	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/dpscalc/attackdist"
)

func getAttackDistProbabilitySums(attackDist *attackdist.AttackDistribution) []float64 {
	sums := make([]float64, len(attackDist.Distributions))
	for i, dist := range attackDist.Distributions {
		for _, weightedHit := range dist.Hits {
			sums[i] += weightedHit.Probability
		}
	}
	return sums
}

func testGetAttackDist(t *testing.T, testInputSetups testInputSetups) {
	for setupName, testInputSetup := range testInputSetups {
		player := getPlayer(&testInputSetup.InputSetup.GlobalSettings, &testInputSetup.InputSetup.InputGearSetups[0])
		accuracy := 0.543
		maxHit := 73
		attackDist := getAttackDistribution(player, accuracy, maxHit)
		probabilitySums := getAttackDistProbabilitySums(attackDist)

		for _, sum := range probabilitySums {
			if !isFloatEqual(float32(sum), 1.0, floatTolerance) {
				t.Errorf("FAIL: " + setupName + " - Expected probability: " + fmt.Sprintf("%f", 1.0) + ", Actual: " + fmt.Sprintf("%f", sum))
			}
		}
	}
}

func TestGetAttackDist(t *testing.T) {
	testInputSetups := loadTestInputSetups("input_setups.json")
	testGetAttackDist(t, testInputSetups)
}

func TestGetAttackDistSpec(t *testing.T) {
	testInputSetups := loadTestInputSetups("spec_input_setups.json")
	testGetAttackDist(t, testInputSetups)
}
