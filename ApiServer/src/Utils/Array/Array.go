package Array

func Swap(input *[]int64, from int, to int) {
	output := make([]int64, len(*input))
	copy(output, *input)

	// Cut
	value := (*input)[from]
	output = append(output[:from], output[from+1:]...)

	// Insert
	output = append(output[:to+1], output[to:]...)
	output[to] = value

	*input = output
}
