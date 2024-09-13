package dpscalc

import "testing"

func BenchmarkDpsCalc(b *testing.B) {
	b.StopTimer()
	inputSetups := loadTestInputSetups("benchmark_setups.json")
	setup := inputSetups["Manticore scy/fang/tbow/shadow/bp"]

	b.StartTimer()
	for i := 0; i < b.N; i++ {
		RunDpsCalc(&setup.InputSetup)
	}
}
