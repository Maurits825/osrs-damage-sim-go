import { InputSetup } from 'src/app/model/damage-sim/input-setup.model';

export interface UnitTest {
  expectedDps: number;
  inputSetup: InputSetup;
}
