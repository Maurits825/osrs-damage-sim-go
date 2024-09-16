package dpscalc

import (
	"fmt"
	"math"
	"testing"

	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/testutil"
)

type testInputSetups map[string]testInputSetup

type testInputSetup struct {
	ExpectedDps float32    `json:"expectedDps"`
	InputSetup  InputSetup `json:"inputSetup"`
}

var floatTolerance = float32(0.000001)

func isFloatEqual(a, b, t float32) bool {
	if a == b {
		return true
	}
	if d := math.Abs(float64(a - b)); d < float64(t) {
		return true
	}
	return false
}

func testDpsCalc(t *testing.T, testInputSetups testInputSetups) {
	for setupName, testInputSetup := range testInputSetups {
		dpsCalcResults := RunDpsCalc(&testInputSetup.InputSetup)
		if !isFloatEqual(dpsCalcResults.Results[0].TheoreticalDps, testInputSetup.ExpectedDps, floatTolerance) {
			t.Errorf("FAIL: " + setupName + " - Expected dps: " + fmt.Sprintf("%f", testInputSetup.ExpectedDps) + ", Actual: " + fmt.Sprintf("%f", dpsCalcResults.Results[0].TheoreticalDps))
		}
	}
}

func TestRunDpsCalc(t *testing.T) {
	testInputSetups := *testutil.LoadTestFile[testInputSetups]("input_setups.json")
	testDpsCalc(t, testInputSetups)
}

func TestRunDpsCalcSpec(t *testing.T) {
	testInputSetups := *testutil.LoadTestFile[testInputSetups]("spec_input_setups.json")
	testDpsCalc(t, testInputSetups)
}
