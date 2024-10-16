import { Component, Input } from '@angular/core';
import { SimpleSimResults } from 'src/app/model/simple-dmg-sim/simple-sim-results.model';

@Component({
  selector: 'app-simple-sim-results',
  templateUrl: './simple-sim-results.component.html',
})
export class SimpleSimResultsComponent {
  @Input()
  results: SimpleSimResults;
}
