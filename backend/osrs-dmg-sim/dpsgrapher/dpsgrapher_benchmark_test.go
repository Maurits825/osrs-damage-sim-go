package dpsgrapher

import (
	"testing"

	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/testutil"
)

func BenchmarkDpsGrapher(b *testing.B) {
	inputSetups := *testutil.LoadTestFile[testInputSetups]("benchmark_setups.json")
	for setupName, testSetup := range inputSetups {
		b.Run(setupName, func(b *testing.B) {
			for i := 0; i < b.N; i++ {
				RunDpsGrapher(testSetup.InputSetup)
			}
		})
	}
}
