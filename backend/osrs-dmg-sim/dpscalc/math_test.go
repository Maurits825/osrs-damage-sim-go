package dpscalc

import "testing"

func TestFactorial(t *testing.T) {
	cases := []struct {
		input    int
		expected int
	}{
		{0, 1},
		{1, 1},
		{5, 120},
	}

	for _, c := range cases {
		r := factorial(c.input)
		if r != c.expected {
			t.Errorf("factorial(%d)", c.input)
		}
	}
}

func TestBinomial(t *testing.T) {
	cases := []struct {
		n        int
		k        int
		expected int
	}{
		{4, 2, 6},
		{4, 1, 4},
		{11, 6, 462},
	}

	for _, c := range cases {
		r := binomial(c.n, c.k)
		if r != c.expected {
			t.Errorf("binomial(%d, %d)", c.n, c.k)
		}
	}
}
