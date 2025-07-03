import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { InputSetup } from 'src/app/model/simple-dmg-sim/input-setup.model';
import { DetailedRun, SimpleSimResult } from 'src/app/model/simple-dmg-sim/simple-sim-results.model';
import { SimpleDmgSimInputService } from 'src/app/services/simple-dmg-sim-input.service';

@Component({
  selector: 'app-detailed-run-results',
  templateUrl: './detailed-run-results.component.html',
  styleUrl: './detailed-run-results.component.css',
})
export class DetailedRunResultsComponent implements OnChanges {
  @Input()
  results: SimpleSimResult[];
  selectedResult: SimpleSimResult;
  selectedDetailedRun: DetailedRun;
  selectedInputIndex: number;

  inputSetup: InputSetup;

  SimpleSimResult: SimpleSimResult;
  DetailedRun: DetailedRun;

  constructor(private inputSetupService: SimpleDmgSimInputService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['results'] && this.results) {
      this.inputSetup = cloneDeep(this.inputSetupService.getInputSetup());
      this.selectedResultChanged(this.results[0]);
    }
  }

  selectedResultChanged(result: SimpleSimResult): void {
    this.selectedResult = result;
    this.selectedDetailedRun = result.detailedRuns[0];
    this.selectedInputIndex = this.results.findIndex((r: SimpleSimResult) => r === result);
  }

  selectedDetailedRunChange(detailedRun: DetailedRun): void {
    this.selectedDetailedRun = detailedRun;
  }
}
