import { Component, OnInit } from '@angular/core';
import { merge } from 'lodash-es';
import { mapGlobalSettingsToNpcInfo, mapNpcInfoToGlobalSettings } from 'src/app/helpers/data-mapping.helper';
import { NpcInfo } from 'src/app/model/osrs/npc.model';
import { GlobalSettings } from 'src/app/model/shared/global-settings.model';
import { SimSettings } from 'src/app/model/simple-dmg-sim/input-setup.model';
import { SimpleDmgSimInputService } from 'src/app/services/simple-dmg-sim-input.service';

@Component({
  selector: 'app-simple-sim-settings',
  templateUrl: './simple-sim-settings.component.html',
})
export class SimpleSimSettingsComponent implements OnInit {
  //todo is this scuffed? - the whole maping stuff
  globalSettings: GlobalSettings;
  simSettings: SimSettings;
  npcInfo: NpcInfo = {
    npc: null,
    raidLevel: 0,
    pathLevel: 0,
    overlyDraining: false,
    isChallengeMode: false,
  };

  constructor(private inputService: SimpleDmgSimInputService) {}

  ngOnInit(): void {
    this.inputService.globalSettingsWatch().subscribe((settings: GlobalSettings) => {
      this.globalSettings = settings;
      this.npcInfo = mapGlobalSettingsToNpcInfo(this.globalSettings);
    });

    this.inputService.simSettingsWatch().subscribe((settings: SimSettings) => {
      this.simSettings = settings;
    });
  }

  npcInfoChanged(npcInfo: NpcInfo): void {
    this.npcInfo = npcInfo;
    this.globalSettings = merge(this.globalSettings, mapNpcInfoToGlobalSettings(npcInfo));
  }
}
