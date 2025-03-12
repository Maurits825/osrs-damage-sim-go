import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DpsResults } from 'src/app/model/dps-calc/dps-results.model';
import { InputSetup } from 'src/app/model/dps-calc/input-setup.model';
import { DpsCalcInputService } from 'src/app/services/dps-calc-input.service';
import { cloneDeep } from 'lodash-es';
import { Npc } from 'src/app/model/osrs/npc.model';

@Component({
  selector: 'app-dps-results',
  templateUrl: './dps-results.component.html',
})
export class DpsResultsComponent implements OnChanges {
  @Input()
  dpsResults: DpsResults;

  inputSetup: InputSetup;

  Npc: Npc;
  selectedMultiNpc: Npc;
  selectedMultiNpcIndex: number = 0;

  constructor(private cd: ChangeDetectorRef, private inputSetupService: DpsCalcInputService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dpsResults'] && this.dpsResults && !this.dpsResults.error) {
      this.inputSetup = cloneDeep(this.inputSetupService.getInputSetup());
      if (this.inputSetup.multiNpcs.length > 0) {
        this.selectedNpcChange(this.inputSetup.multiNpcs[0]);
      }
      this.cd.detectChanges();
    }
  }

  selectedNpcChange(npc: Npc): void {
    this.selectedMultiNpc = npc;
    this.selectedMultiNpcIndex = this.inputSetup.multiNpcs.findIndex((n) => n === npc);
  }
}
