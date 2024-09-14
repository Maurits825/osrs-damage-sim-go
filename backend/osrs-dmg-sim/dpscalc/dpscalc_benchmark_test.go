package dpscalc

import "testing"

func BenchmarkDpsCalc(b *testing.B) {
	inputSetups := loadTestInputSetups("benchmark_setups.json")
	for setupName, testSetup := range inputSetups {
		b.Run(setupName, func(b *testing.B) {
			for i := 0; i < b.N; i++ {
				RunDpsCalc(&testSetup.InputSetup)
			}
		})
	}
}
