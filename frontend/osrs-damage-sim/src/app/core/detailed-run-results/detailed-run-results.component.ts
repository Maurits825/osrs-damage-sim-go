import { Component, Input } from '@angular/core';
import { DetailedRun, TickDataDetails } from 'src/app/model/damage-sim/damage-sim-results.model';
import { detailedRunsMock } from './run-mock.const';

@Component({
  selector: 'app-detailed-run-results',
  templateUrl: './detailed-run-results.component.html',
  styleUrls: ['./detailed-run-results.component.css'],
})
export class DetailedRunResultsComponent {
  @Input()
  detailedRuns: DetailedRun[] = detailedRunsMock;

  selectedDetailedRun: DetailedRun;
  selectedTickDetails: TickDataDetails;

  DetailedRun: DetailedRun;
  TickDataDetails: TickDataDetails;

  selectedDetailedRunChange(detailedRun: DetailedRun): void {
    this.selectedDetailedRun = detailedRun;
  }
  selectedTickDetailsChange(tickDetails: TickDataDetails): void {
    this.selectedTickDetails = tickDetails;
  }

  getSelectedDetailedRunIndex(): number {
    return this.detailedRuns.findIndex((detailedRun: DetailedRun) => detailedRun === this.selectedDetailedRun);
  }
}
