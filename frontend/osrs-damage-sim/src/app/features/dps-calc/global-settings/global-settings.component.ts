import { Component, OnDestroy, OnInit } from '@angular/core';
import { DpsCalcInputService } from 'src/app/services/dps-calc-input.service';
import { Subject, takeUntil } from 'rxjs';
import { InputSetup } from 'src/app/model/dps-calc/input-setup.model';
import { NpcInfo } from 'src/app/model/osrs/npc.model';
import { mapGlobalSettingsToNpcInfo, mapNpcInfoToGlobalSettings } from 'src/app/helpers/data-mapping.helper';
import { merge } from 'lodash-es';
import { DEFAULT_GLOBAL_SETTIJNGS, GlobalSettings } from 'src/app/model/shared/global-settings.model';

@Component({
  selector: 'app-global-settings',
  templateUrl: './global-settings.component.html',
})
export class GlobalSettingsComponent implements OnInit, OnDestroy {
  globalSettings: GlobalSettings = DEFAULT_GLOBAL_SETTIJNGS;

  npcInfo: NpcInfo = mapGlobalSettingsToNpcInfo(this.globalSettings);

  private destroyed$ = new Subject();

  constructor(private inputSetupService: DpsCalcInputService) {}

  ngOnInit(): void {
    this.inputSetupService.loadInputSetup$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((inputSetup: InputSetup) => this.setGlobalSettings(inputSetup.globalSettings));

    //TODO this is scuffed?
    this.inputSetupService.globalSettingProvider = { getGlobalSettings: () => this.globalSettings };
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  setGlobalSettings(globalSettings: GlobalSettings): void {
    this.globalSettings = globalSettings;
    this.npcInfo = mapGlobalSettingsToNpcInfo(globalSettings);
  }

  npcInfoChanged(npcInfo: NpcInfo): void {
    this.globalSettings = merge(this.globalSettings, mapNpcInfoToGlobalSettings(npcInfo));
  }
}
