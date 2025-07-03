import { ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DpsCalcResults, DpsResults } from 'src/app/model/dps-calc/dps-results.model';
import { InputSetup } from 'src/app/model/dps-calc/input-setup.model';
import { DpsCalcInputService } from 'src/app/services/dps-calc-input.service';
import { cloneDeep } from 'lodash-es';
import { Npc } from 'src/app/model/osrs/npc.model';
import { BestResultsIndex, RESULT_TABS, TabInfo, TabType } from './dps-results.model';

@Component({
  selector: 'app-dps-results',
  templateUrl: './dps-results.component.html',
  styleUrls: ['./dps-results.component.css'],
})
export class DpsResultsComponent implements OnChanges {
  @Input()
  dpsResults: DpsResults;

  inputSetup: InputSetup;

  Npc: Npc;
  selectedMultiNpc: Npc;
  selectedMultiNpcIndex = 0;

  resultTabs = RESULT_TABS;
  TabType = TabType;
  activeResultTab: TabInfo = RESULT_TABS[0];

  bestResultsIndices: BestResultsIndex[];

  constructor(
    private cd: ChangeDetectorRef,
    private inputSetupService: DpsCalcInputService,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dpsResults'] && this.dpsResults && !this.dpsResults.error) {
      this.inputSetup = cloneDeep(this.inputSetupService.getInputSetup());
      if (this.inputSetup.multiNpcs.length > 0) {
        this.selectedNpcChange(this.inputSetup.multiNpcs[0]);
      }

      this.bestResultsIndices = this.getBestValues(this.dpsResults.dpsCalcResults);

      this.cd.detectChanges();
    }
  }

  selectedNpcChange(npc: Npc): void {
    this.selectedMultiNpc = npc;
    this.selectedMultiNpcIndex = this.inputSetup.multiNpcs.findIndex((n) => n === npc);
  }

  getBestValues(dpsCalcResults: DpsCalcResults[]): BestResultsIndex[] {
    const bestIndices: BestResultsIndex[] = [];
    for (let i = 0; i < dpsCalcResults.length; i++) {
      bestIndices.push({ dps: 0, accuracy: 0, maxHit: 0 });
      const bestValues: BestResultsIndex = { dps: 0, accuracy: 0, maxHit: 0 };

      for (let j = 0; j < dpsCalcResults[i].results.length; j++) {
        const dpsResults = dpsCalcResults[i].results[j];
        if (dpsResults.theoreticalDps > bestValues.dps) {
          bestValues.dps = dpsResults.theoreticalDps;
          bestIndices[i].dps = j;
        }
        if (dpsResults.accuracy > bestValues.accuracy) {
          bestValues.accuracy = dpsResults.accuracy;
          bestIndices[i].accuracy = j;
        }

        const maxHit = dpsResults.maxHit.reduce((a, b) => a + b, 0);
        if (maxHit > bestValues.maxHit) {
          bestValues.maxHit = maxHit;
          bestIndices[i].maxHit = j;
        }
      }
    }

    return bestIndices;
  }
}
