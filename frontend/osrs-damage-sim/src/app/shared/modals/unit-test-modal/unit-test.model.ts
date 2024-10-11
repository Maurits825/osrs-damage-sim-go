import { InputSetup } from 'src/app/model/dps-calc/input-setup.model';

export interface UnitTest {
  expectedDps: number;
  inputSetup: InputSetup;
}
