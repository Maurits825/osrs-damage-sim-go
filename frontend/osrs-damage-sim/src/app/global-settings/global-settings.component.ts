import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Boost } from '../model/boost.type';
import { GlobalSettings } from '../model/input-setup.model';
import { Npc } from '../model/npc.model';
import { TOA_PATH_LVL_NPCS, TOA_NPCS } from '../npc-input/npc.const';
import { GlobalBoostService } from '../services/global-boost.service';

@Component({
  selector: 'app-global-settings',
  templateUrl: './global-settings.component.html',
  styleUrls: ['./global-settings.component.css'],
})
export class GlobalSettingsComponent implements OnInit {
  @Output()
  submitClicked = new EventEmitter<GlobalSettings>();

  globalSettings: GlobalSettings = {
    npcId: null,
    iterations: 10000,
    teamSize: 1,
    raidLevel: 0,
    pathLevel: 0,
  };

  showPathLevel = false;
  showRaidLevel = false;

  selectedBoosts: Set<Boost>;

  loading = false;

  constructor(private globalBoostService: GlobalBoostService) {}

  ngOnInit(): void {
    this.selectedBoosts = this.globalBoostService.getBoosts();
  }

  submit(): void {
    this.submitClicked.emit(this.globalSettings);
  }

  npcChanged(npc: Npc): void {
    this.globalSettings.npcId = npc.id;

    const npcName = npc.name;
    this.showPathLevel = false;
    this.showRaidLevel = false;

    if (TOA_PATH_LVL_NPCS.includes(npcName)) {
      this.showPathLevel = true;
      this.showRaidLevel = true;
    } else if (TOA_NPCS.includes(npcName)) {
      this.showRaidLevel = true;
      this.globalSettings.pathLevel = 0;
    } else {
      this.globalSettings.raidLevel = 0;
      this.globalSettings.pathLevel = 0;
    }
  }

  boostAdded(boost: Boost): void {
    this.globalBoostService.addBoost(boost);
  }

  boostRemoved(boost: Boost): void {
    this.globalBoostService.removeBoost(boost);
  }
}
