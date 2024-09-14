package dpsgrapher

import "testing"

func BenchmarkDpsGrapher(b *testing.B) {
	inputSetups := loadTestInputSetups("benchmark_setups.json")
	for setupName, testSetup := range inputSetups {
		b.Run(setupName, func(b *testing.B) {
			for i := 0; i < b.N; i++ {
				RunDpsGrapher(&testSetup.InputSetup)
			}
		})
	}
}
