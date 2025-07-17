package simpledmgsim

import (
	"fmt"
	"math/rand/v2"
	"testing"

	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/testutil"
)

type testInputSetups map[string]testInputSetup

type testInputSetup struct {
	ExpectedTicksTokill int        `json:"ExpectedTicksTokill"`
	InputSetup          InputSetup `json:"inputSetup"`
}

func TestRunDistSim(t *testing.T) {
	testInputSetups := *testutil.LoadTestFile[testInputSetups]("sim_input_setups.json")

	for setupName, testInputSetup := range testInputSetups {
		inputSetup := testInputSetup.InputSetup
		rng := rand.New(rand.NewPCG(420, 69))
		runner := newDistSimRunner(100, rng)

		results := runner.runDistSim(&inputSetup, 0)
		if results.AverageTtk != testInputSetup.ExpectedTicksTokill {
			t.Errorf("FAIL: " + setupName + " - Expected ticks: " + fmt.Sprintf("%v", testInputSetup.ExpectedTicksTokill) + ", Actual: " + fmt.Sprintf("%v", results.AverageTtk))
		}
	}
}
