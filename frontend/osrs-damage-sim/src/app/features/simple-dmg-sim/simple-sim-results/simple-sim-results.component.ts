import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { InputSetup } from 'src/app/model/simple-dmg-sim/input-setup.model';
import { SimpleSimResults } from 'src/app/model/simple-dmg-sim/simple-sim-results.model';
import { SimpleDmgSimInputService } from 'src/app/services/simple-dmg-sim-input.service';

@Component({
  selector: 'app-simple-sim-results',
  templateUrl: './simple-sim-results.component.html',
})
export class SimpleSimResultsComponent implements OnChanges {
  @Input()
  results: SimpleSimResults;

  inputSetup: InputSetup;

  constructor(private inputSetupService: SimpleDmgSimInputService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['results'] && this.results && !this.results.error) {
      this.inputSetup = cloneDeep(this.inputSetupService.getInputSetup());
    }
  }
}
