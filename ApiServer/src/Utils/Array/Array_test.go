package Array

import (
	"log"
	"testing"
)

func TestSwap(t *testing.T) {
	tests := []struct {
		from   int
		to     int
		output []int64
	}{
		{
			from:   1,
			to:     0,
			output: []int64{1, 0, 2, 3, 4},
		},
		{
			from:   0,
			to:     1,
			output: []int64{1, 0, 2, 3, 4},
		},
		{
			from:   4,
			to:     3,
			output: []int64{0, 1, 2, 4, 3},
		},
		{
			from:   0,
			to:     4,
			output: []int64{1, 2, 3, 4, 0},
		},
		{
			from:   3,
			to:     0,
			output: []int64{3, 0, 1, 2, 4},
		},
	}

	for _, test := range tests {
		input := []int64{0, 1, 2, 3, 4 }

		log.Println("running test", input, test.output, test.from, test.to)

		Swap(&input, test.from, test.to)

		if len(input) != len(test.output) {
			t.Error("lengths do not match: expected", len(test.output), "got", len(input))
		}
		for i, v := range input {
			if test.output[i] != v {
				t.Error("mismatch: expected", test.output, "got", input)
			}
		}
	}
}
