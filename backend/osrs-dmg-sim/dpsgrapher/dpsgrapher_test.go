package dpsgrapher

import (
	"encoding/json"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"testing"

	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/dpscalc"
)

type testInputSetups map[string]testInputSetup

type testInputSetup struct {
	ExpectedDps float32            `json:"expectedDps"`
	InputSetup  dpscalc.InputSetup `json:"inputSetup"`
}

func loadTestInputSetups(file string) testInputSetups {
	filePath := filepath.Join("../testdata", file)
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

func testDpsGrapher(t *testing.T, testInputSetups testInputSetups) {
	for setupName, testInputSetup := range testInputSetups {
		dpsCalcResults := RunDpsGrapher(&testInputSetup.InputSetup)
		if len(dpsCalcResults.Results) == 0 {
			t.Errorf("Empty dps grapher results: " + setupName)
		}
	}
}
func TestRunDpsGrapher(t *testing.T) {
	testInputSetups := loadTestInputSetups("input_setups.json")
	testDpsGrapher(t, testInputSetups)
}

func TestRunDpsGrapherSpec(t *testing.T) {
	testInputSetups := loadTestInputSetups("spec_input_setups.json")
	testDpsGrapher(t, testInputSetups)
}
