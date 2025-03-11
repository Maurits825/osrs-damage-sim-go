import { Component, EventEmitter, Output } from '@angular/core';
import { mapGlobalSettingsToNpcInfo } from 'src/app/helpers/data-mapping.helper';
import { Npc, NpcInfo } from 'src/app/model/osrs/npc.model';
import { DEFAULT_GLOBAL_SETTINGS } from 'src/app/model/shared/global-settings.model';

@Component({
  selector: 'app-multi-npc-input',
  templateUrl: './multi-npc-input.component.html',
})
export class MultiNpcInputComponent {
  @Output()
  npcInfoChanged = new EventEmitter<NpcInfo>();

  selectedNpcInfo: NpcInfo | null = null;
  npcs: Npc[] = [];

  emptyNpcInfo: NpcInfo = mapGlobalSettingsToNpcInfo(DEFAULT_GLOBAL_SETTINGS);

  onNpcInfoChanged(npcInfo: NpcInfo): void {
    this.selectedNpcInfo = npcInfo;
  }

  addNpc(): void {
    this.npcs.push(this.selectedNpcInfo.npc);
  }

  removeNpc(npc: Npc): void {
    const index = this.npcs.indexOf(npc);
    if (index >= 0) {
      this.npcs.splice(index, 1);
    }
  }
}
