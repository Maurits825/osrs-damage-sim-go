import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DetailedRun, TickDataDetails } from 'src/app/model/damage-sim/damage-sim-results.model';
import { detailedRunsMock } from './run-mock.const';

@Component({
  selector: 'app-detailed-run-results',
  templateUrl: './detailed-run-results.component.html',
  styleUrls: ['./detailed-run-results.component.css'],
})
export class DetailedRunResultsComponent implements OnChanges {
  @Input()
  detailedRuns: DetailedRun[] = detailedRunsMock;

  selectedDetailedRun: DetailedRun = this.detailedRuns[0];
  selectedTickDetails: TickDataDetails = this.selectedDetailedRun.tick_data_details[0];

  DetailedRun: DetailedRun;
  TickDataDetails: TickDataDetails;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['detailedRuns']) {
      this.selectedDetailedRun = null;
      this.selectedTickDetails = null;
    }
  }

  selectedDetailedRunChange(detailedRun: DetailedRun): void {
    this.selectedDetailedRun = detailedRun;
    this.selectedTickDetails = null;
  }

  selectedTickDetailsChange(tickDetails: TickDataDetails): void {
    this.selectedTickDetails = tickDetails;
  }

  getSelectedDetailedRunIndex(): number {
    return this.detailedRuns.findIndex((detailedRun: DetailedRun) => detailedRun === this.selectedDetailedRun);
  }

  sumArray(values: number[]): number {
    return values.reduce((a: number, b: number) => a + b);
  }
}
