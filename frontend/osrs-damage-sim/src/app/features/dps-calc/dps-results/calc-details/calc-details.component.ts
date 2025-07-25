import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DpsCalcResult, DpsCalcResults } from 'src/app/model/dps-calc/dps-results.model';
import { InputSetup } from 'src/app/model/dps-calc/input-setup.model';

@Component({
  selector: 'app-calc-details',
  templateUrl: './calc-details.component.html',
})
export class CalcDetailsComponent implements OnChanges {
  @Input()
  dpsCalcResults: DpsCalcResults;

  @Input()
  inputSetup: InputSetup;

  DpsCalcResult: DpsCalcResult;
  selectedDpsCalcResult: DpsCalcResult;
  selectedDpsCalcResultIndex: number;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dpsCalcResults']) {
      this.selectedDpsCalcResultIndex = 0;
      this.selectedDpsCalcResult = this.dpsCalcResults.results[this.selectedDpsCalcResultIndex];
    }
  }

  selectedDpsResultChange(dpsCalcResult: DpsCalcResult): void {
    this.selectedDpsCalcResult = dpsCalcResult;
    this.selectedDpsCalcResultIndex = this.dpsCalcResults.results.findIndex(
      (calcResult) => calcResult === dpsCalcResult,
    );
  }
}
