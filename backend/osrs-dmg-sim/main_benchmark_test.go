package main

import (
	"testing"

	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/dpscalc"
	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/dpsgrapher"
	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/testutil"
)

type testInputSetups map[string]testInputSetup

type testInputSetup struct {
	InputSetup dpscalc.InputSetup `json:"inputSetup"`
}

func BenchmarkMainDpsCalc(b *testing.B) {
	inputSetups := *testutil.LoadTestFile[testInputSetups]("benchmark_setups.json")
	for setupName, testSetup := range inputSetups {
		b.Run(setupName, func(b *testing.B) {
			for i := 0; i < b.N; i++ {
				dpscalc.RunDpsCalc(&testSetup.InputSetup)
				dpsgrapher.RunDpsGrapher(&testSetup.InputSetup)
			}
		})
	}
}
