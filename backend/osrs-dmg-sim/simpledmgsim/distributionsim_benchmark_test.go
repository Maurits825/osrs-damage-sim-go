package simpledmgsim

import (
	"math/rand/v2"
	"testing"

	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/testutil"
)

func BenchmarkRunDistSim(b *testing.B) {
	testInputSetups := *testutil.LoadTestFile[testInputSetups]("sim_input_setups.json")

	for setupName, testInputSetup := range testInputSetups {
		inputSetup := testInputSetup.InputSetup
		rng := rand.New(rand.NewPCG(420, 69))
		runner := newDistSimRunner(1000, rng)

		b.Run(setupName, func(b *testing.B) {
			for i := 0; i < b.N; i++ {
				runner.runDistSim(inputSetup.GearPresets, &inputSetup.GlobalSettings, inputSetup.InputGearSetups[0])
			}
		})
	}
}
