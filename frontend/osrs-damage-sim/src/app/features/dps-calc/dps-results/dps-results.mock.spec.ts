import { DpsGrapherResults, DpsGrapherResult } from 'src/app/model/dps-calc/dps-grapher-results.model';
import { DpsCalcResult, DpsCalcResults } from 'src/app/model/dps-calc/dps-results.model';

export const dpsGrapherResultMock: DpsGrapherResult = {
  graphType: 'Elder maul',
  xValues: [1, 2, 3],
  graphData: [
    {
      label: 'Test Data',
      dps: [100, 200, 300],
      expectedHit: [50, 100, 150],
      maxHit: [80, 160, 240],
      accuracy: [90, 95, 98],
    },
  ],
};

export const dpsGrapherResultsMock: DpsGrapherResults = {
  results: [dpsGrapherResultMock, dpsGrapherResultMock],
};

export const dpsCalcResultMock: DpsCalcResult = {
  error: null,
  labels: {
    gearSetupSettingsLabel: 'Test Gear Setup Settings',
    gearSetupName: 'Test Gear Setup',
  },
  theoreticalDps: 1234.56,
  maxHit: [100, 200, 300],
  accuracy: 95,
  attackRoll: 150,
  expectedHit: 120,
  hitDist: [0, 1, 2, 3, 4, 5],
  ticksToKill: 10,
  calcDetails: ['Detail1', 'Detail2'],
};

export const dpsCalcResultsMock: DpsCalcResults = {
  title: 'Test DPS Results',
  results: [dpsCalcResultMock, dpsCalcResultMock],
};
