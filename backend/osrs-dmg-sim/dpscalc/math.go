package dpscalc

import "math"

func gcd(a, b int) int {
	for b != 0 {
		a, b = b, a%b
	}
	return a
}

func lcm(a, b int) int {
	return int(math.Abs(float64(a*b)) / float64(gcd(a, b)))
}

func binomial(n, k int) int {
	return factorial(n) / (factorial(n-k) * factorial(k))
}

func factorial(v int) int {
	r := 1
	for i := v; i > 0; i-- {
		r *= i
	}
	return r
}
