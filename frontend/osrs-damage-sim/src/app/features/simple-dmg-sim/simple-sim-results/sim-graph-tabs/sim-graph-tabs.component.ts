import { Component, Input } from '@angular/core';
import { SimpleSimResult } from 'src/app/model/simple-dmg-sim/simple-sim-results.model';
import { GraphTab, GraphType, SIM_GRAPH_TABS } from './sim-graph-tabs.model';
import { InputSetup } from 'src/app/model/simple-dmg-sim/input-setup.model';

@Component({
  selector: 'app-sim-graph-tabs',
  templateUrl: './sim-graph-tabs.component.html',
})
export class SimGraphTabsComponent {
  @Input()
  simpleSimResults: SimpleSimResult[];

  @Input()
  inputSetup: InputSetup;

  graphTabs = SIM_GRAPH_TABS;
  GraphType = GraphType;
  activeTab: GraphTab = SIM_GRAPH_TABS[0];
}
