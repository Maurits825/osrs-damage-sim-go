package dpscalc

import (
	"encoding/json"
	"fmt"
	"io"
	"math"
	"os"
	"path/filepath"
	"testing"
)

type testInputSetups map[string]testInputSetup

type testInputSetup struct {
	ExpectedDps float32    `json:"expectedDps"`
	InputSetup  InputSetup `json:"inputSetup"`
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

var floatTolerance = float32(0.000001)

func isFloatEqual(a, b, t float32) bool {
	if a == b {
		return true
	}
	if d := math.Abs(float64(a - b)); d < float64(t) {
		return true
	}
	return false
}

func testDpsCalc(t *testing.T, testInputSetups testInputSetups) {
	for setupName, testInputSetup := range testInputSetups {
		dpsCalcResults := RunDpsCalc(&testInputSetup.InputSetup)
		if !isFloatEqual(dpsCalcResults.Results[0].TheoreticalDps, testInputSetup.ExpectedDps, floatTolerance) {
			t.Errorf("FAIL: " + setupName + " - Expected dps: " + fmt.Sprintf("%f", testInputSetup.ExpectedDps) + ", Actual: " + fmt.Sprintf("%f", dpsCalcResults.Results[0].TheoreticalDps))
		}
	}
}
func TestRunDpsCalc(t *testing.T) {
	testInputSetups := loadTestInputSetups("input_setups.json")
	testDpsCalc(t, testInputSetups)
}

func TestRunDpsCalcSpec(t *testing.T) {
	testInputSetups := loadTestInputSetups("spec_input_setups.json")
	testDpsCalc(t, testInputSetups)
}
