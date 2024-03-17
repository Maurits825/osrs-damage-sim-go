package dpscalc

import (
	"encoding/json"
	"fmt"
	"io"
	"os"
	"testing"
)

type testInputSetups map[string]testInputSetup

type testInputSetup struct {
	ExpectedDps float32    `json:"expectedDps"`
	InputSetup  InputSetup `json:"inputSetup"`
}

func loadTestInputSetups(filePath string) testInputSetups {
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
func TestRunDpsCalc(t *testing.T) {
	filePath := "testdata/test_input_setups.json"
	testInputSetups := loadTestInputSetups(filePath)
	for setupName, testInputSetup := range testInputSetups {
		fmt.Println(setupName)
		dpsCalcResults := RunDpsCalc(&testInputSetup.InputSetup, false)
		if dpsCalcResults.Results[0].TheoreticalDps != testInputSetup.ExpectedDps {
			t.Errorf("Expected: "+fmt.Sprintf("%f", testInputSetup.ExpectedDps), ", Actual: "+fmt.Sprintf("%f", dpsCalcResults.Results[0].TheoreticalDps))
		}
	}
}
