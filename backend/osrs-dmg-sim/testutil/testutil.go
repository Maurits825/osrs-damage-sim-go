package testutil

import (
	"embed"
	"encoding/json"
	"fmt"
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
