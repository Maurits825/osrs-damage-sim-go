package main

import (
	"encoding/json"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"testing"

	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/dpscalc"
	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/dpsgrapher"
)

type testInputSetups map[string]testInputSetup

type testInputSetup struct {
	ExpectedDps float32            `json:"expectedDps"`
	InputSetup  dpscalc.InputSetup `json:"inputSetup"`
}

func loadTestInputSetups(file string) testInputSetups {
	filePath := filepath.Join("testdata", file)
	inputSetupFile, err := os.Open(filePath)

	if err != nil {
		fmt.Println(err)
		return testInputSetups{}
	}

	defer inputSetupFile.Close()

	byteValue, _ := io.ReadAll(inputSetupFile)
	var testInputSetups testInputSetups
	if err := json.Unmarshal(byteValue, &testInputSetups); err != nil {
		fmt.Println("Error decoding inputsetup JSON:", err)
		return nil
	}

	return testInputSetups
}

func BenchmarkMainDpsCalc(b *testing.B) {
	inputSetups := loadTestInputSetups("benchmark_setups.json")
	for setupName, testSetup := range inputSetups {
		b.Run(setupName, func(b *testing.B) {
			for i := 0; i < b.N; i++ {
				dpscalc.RunDpsCalc(&testSetup.InputSetup)
				dpsgrapher.RunDpsGrapher(&testSetup.InputSetup)
			}
		})
	}
}
