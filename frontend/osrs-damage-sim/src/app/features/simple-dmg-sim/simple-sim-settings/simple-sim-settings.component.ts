import { Component } from '@angular/core';
import { NpcInfo } from 'src/app/model/osrs/npc.model';

@Component({
  selector: 'app-simple-sim-settings',
  templateUrl: './simple-sim-settings.component.html',
})
export class SimpleSimSettingsComponent {
  npcInfo: NpcInfo = {
    npc: null,
    raidLevel: 0,
    pathLevel: 0,
    overlyDraining: false,
    isChallengeMode: false,
  };

  npcInfoChanged(npcInfo: NpcInfo): void {
    this.npcInfo = npcInfo;
  }
}
