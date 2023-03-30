import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DetailedRun, TickData, TickDataDetails } from 'src/app/model/damage-sim/damage-sim-results.model';
import { GearSlot } from 'src/app/model/osrs/gear-slot.enum';
import { ItemService } from 'src/app/services/item.service';

@Component({
  selector: 'app-detailed-run-results',
  templateUrl: './detailed-run-results.component.html',
  styleUrls: ['./detailed-run-results.component.css'],
})
export class DetailedRunResultsComponent implements OnChanges {
  @Input()
  detailedRuns: DetailedRun[];

  selectedDetailedRun: DetailedRun;
  selectedTickDetails: TickDataDetails;

  DetailedRun: DetailedRun;
  TickDataDetails: TickDataDetails;

  constructor(private itemService: ItemService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['detailedRuns'] && this.detailedRuns) {
      this.selectedDetailedRun = this.detailedRuns[0];
      this.selectedTickDetails = this.selectedDetailedRun.tick_data_details[0];

      this.detailedRuns.forEach((detailedRun: DetailedRun) => {
        detailedRun.tick_data_details.forEach((tickDataDetails: TickDataDetails) => {
          tickDataDetails.tick_data.forEach((tickData: TickData) => {
            tickData.weapon = this.itemService.getItem(GearSlot.Weapon, tickData.weapon_id);
          });
        });
      });
    }
  }

  selectedDetailedRunChange(detailedRun: DetailedRun): void {
    this.selectedDetailedRun = detailedRun;
    this.selectedTickDetails = this.selectedDetailedRun.tick_data_details[0];
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
