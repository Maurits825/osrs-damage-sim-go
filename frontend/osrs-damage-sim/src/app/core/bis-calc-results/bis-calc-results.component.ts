import { Component, Input } from '@angular/core';
import { BisCalcResults } from 'src/app/model/damage-sim/bis-calc-result.model';

@Component({
  selector: 'app-bis-calc-results',
  templateUrl: './bis-calc-results.component.html',
})
export class BisCalcResultsComponent {
  @Input()
  bisResults: BisCalcResults;
}
