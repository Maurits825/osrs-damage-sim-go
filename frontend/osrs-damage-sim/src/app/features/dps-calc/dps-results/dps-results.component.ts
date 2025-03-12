import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DpsResults } from 'src/app/model/dps-calc/dps-results.model';
import { InputSetup } from 'src/app/model/dps-calc/input-setup.model';
import { DpsCalcInputService } from 'src/app/services/dps-calc-input.service';
import { cloneDeep } from 'lodash-es';

@Component({
  selector: 'app-dps-results',
  templateUrl: './dps-results.component.html',
})
export class DpsResultsComponent implements OnChanges {
  @Input()
  dpsResults: DpsResults;

  inputSetup: InputSetup;

  constructor(private cd: ChangeDetectorRef, private inputSetupService: DpsCalcInputService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dpsResults'] && this.dpsResults && !this.dpsResults.error) {
      this.inputSetup = cloneDeep(this.inputSetupService.getInputSetup());
      this.cd.detectChanges();
    }
  }
}
