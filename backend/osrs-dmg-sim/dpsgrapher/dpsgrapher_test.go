package dpsgrapher

import (
	"testing"

	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/dpscalc"
	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/testutil"
)

type testInputSetups map[string]testInputSetup

type testInputSetup struct {
	ExpectedDps float32            `json:"expectedDps"`
	InputSetup  dpscalc.InputSetup `json:"inputSetup"`
}

func testDpsGrapher(t *testing.T, testInputSetups testInputSetups) {
	for setupName, testInputSetup := range testInputSetups {
		dpsCalcResults := RunDpsGrapher(testInputSetup.InputSetup)
		if len(dpsCalcResults[0].Results) == 0 {
			t.Errorf("Empty dps grapher results: " + setupName)
		}
	}
}
func TestRunDpsGrapher(t *testing.T) {
	testInputSetups := *testutil.LoadTestFile[testInputSetups]("input_setups.json")
	testDpsGrapher(t, testInputSetups)
}

func TestRunDpsGrapherSpec(t *testing.T) {
	testInputSetups := *testutil.LoadTestFile[testInputSetups]("spec_input_setups.json")
	testDpsGrapher(t, testInputSetups)
}
