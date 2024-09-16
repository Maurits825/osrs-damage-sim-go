package testutil

import (
	"embed"
	"encoding/json"
	"fmt"
	"math"
)

//go:embed *
var jsonDataEmbed embed.FS

func LoadTestFile[T any](fileName string) *T {
	var data T
	byteValue, err := jsonDataEmbed.ReadFile(fileName)

	if err != nil {
		fmt.Println(err)
		return nil
	}

	if err := json.Unmarshal(byteValue, &data); err != nil {
		fmt.Println(err)
		return nil
	}
	return &data
}

func IsFloatEqual32(a, b, t float32) bool {
	if a == b {
		return true
	}
	if d := math.Abs(float64(a - b)); d < float64(t) {
		return true
	}
	return false
}

func IsFloatEqual64(a, b, t float64) bool {
	if a == b {
		return true
	}
	if d := math.Abs(a - b); d < t {
		return true
	}
	return false
}
