package attackdist

import "testing"

func BenchmarkGetFlatHitDistribution(b *testing.B) {
	b.StopTimer()

	accuracy := 0.7
	minimum := 0
	maximum := 50

	hitDist := GetLinearHitDistribution(accuracy, minimum, maximum)
	attackDist := NewMultiAttackDistribution([]HitDistribution{*hitDist, *hitDist, *hitDist})

	b.StartTimer()
	for i := 0; i < b.N; i++ {
		attackDist.GetFlatHitDistribution()
	}
}
