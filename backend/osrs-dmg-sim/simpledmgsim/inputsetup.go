package simpledmgsim

import (
	"errors"
	"fmt"

	"github.com/Maurits825/osrs-damage-sim-go/backend/osrs-damage-sim/dpscalc"
)

type InputSetup struct {
	GlobalSettings  dpscalc.GlobalSettings `json:"globalSettings"`
	SimSettings     SimSettings            `json:"simSettings"`
	GearPresets     []dpscalc.GearSetup    `json:"gearPresets"`
	InputGearSetups []InputGearSetup       `json:"inputGearSetups"`
}

type SimSettings struct {
	Iterations    int  `json:"iterations"`
	IsDetailedRun bool `json:"isDetailedRun"`
}

type InputGearSetup struct {
	GearSetupSettings dpscalc.GearSetupSettings `json:"gearSetupSettings"`
	MainGearSimSetup  GearSimSetup              `json:"mainGearSimSetup"`
	GearSimSetups     []GearSimSetup            `json:"gearSimSetups"`
}

type GearSimSetup struct {
	GearPresetIndex int         `json:"gearPresetIndex"`
	Conditions      []Condition `json:"conditions"`
}

// TODO types for this
type Condition struct {
	Variable       string `json:"variable"`
	Comparison     string `json:"comparison"`
	Value          int    `json:"value"`
	NextComparison string `json:"nextComparison"`
}

const maxIterations = 1_000_000

func (inputSetup *InputSetup) Validate() error {
	if inputSetup.GlobalSettings.Npc.Id == "" {
		return errors.New("no npc selected")
	}

	if err := inputSetup.GlobalSettings.Validate(); err != nil {
		return err
	}

	if inputSetup.SimSettings.Iterations > maxIterations {
		return fmt.Errorf("max iterations: %d", maxIterations)
	}

	if len(inputSetup.InputGearSetups) == 0 {
		return errors.New("no input gear setups")
	}
	if len(inputSetup.GearPresets) == 0 {
		return errors.New("no gear presets")
	}

	for _, inputGearSetup := range inputSetup.InputGearSetups {
		if err := inputGearSetup.validate(); err != nil {
			return err
		}
	}

	for _, gearSetup := range inputSetup.GearPresets {
		if err := gearSetup.Validate(); err != nil {
			return err
		}
	}

	return nil
}

func (inputGearSetup *InputGearSetup) validate() error {
	if err := inputGearSetup.GearSetupSettings.Validate(); err != nil {
		return err
	}
	return nil
}
