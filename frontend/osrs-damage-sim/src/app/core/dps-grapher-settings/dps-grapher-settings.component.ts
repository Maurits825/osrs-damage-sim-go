import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { GraphType, GraphTypes } from 'src/app/model/damage-sim/dps-grapher-results.model';
import { InputSetupService } from 'src/app/services/input-setup.service';

@Component({
  selector: 'app-dps-grapher-settings',
  templateUrl: './dps-grapher-settings.component.html',
  styleUrls: ['./dps-grapher-settings.component.css'],
})
export class DpsGrapherSettingsComponent implements OnDestroy {
  GraphType: GraphType;
  GraphTypes = [...GraphTypes];

  selectedGraph: GraphType;

  private destroyed$ = new Subject();

  constructor(private inputSetupService: InputSetupService) {}

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  selectedGraphChange(graphType: GraphType): void {
    this.selectedGraph = graphType;
  }
}
