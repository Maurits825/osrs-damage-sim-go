import { Component, OnDestroy, OnInit } from '@angular/core';
import { TOA_NPCS, TOA_PATH_LVL_NPCS } from 'src/app/shared/components/npc-input/npc.const';
import { DpsCalcInputService } from 'src/app/services/dps-calc-input.service';
import { Subject, takeUntil } from 'rxjs';
import { GlobalSettings, InputSetup } from 'src/app/model/dps-calc/input-setup.model';
import { Npc } from 'src/app/model/osrs/npc.model';

@Component({
  selector: 'app-global-settings',
  templateUrl: './global-settings.component.html',
})
export class GlobalSettingsComponent implements OnInit, OnDestroy {
  globalSettings: GlobalSettings = {
    npc: null,
    teamSize: 1,
    raidLevel: 0,
    pathLevel: 0,
    overlyDraining: false,
    coxScaling: {
      partyMaxCombatLevel: 126,
      partyAvgMiningLevel: 99,
      partyMaxHpLevel: 99,
      isChallengeMode: false,
    },
  };

  showPathLevel = false;
  showRaidLevel = false;
  showIsChallengeMode = false;

  loading = false;

  private destroyed$ = new Subject();

  constructor(private inputSetupService: DpsCalcInputService) {}

  ngOnInit(): void {
    this.inputSetupService.loadInputSetup$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((inputSetup: InputSetup) => this.setGlobalSettings(inputSetup.globalSettings));

    this.inputSetupService.globalSettingsComponent$.next(this);
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  setGlobalSettings(globalSettings: GlobalSettings): void {
    this.globalSettings = globalSettings;
    this.npcChanged(this.globalSettings.npc);
  }

  npcChanged(npc: Npc): void {
    this.globalSettings.npc = npc;

    if (!npc) return;

    const npcName = npc.name;
    this.showPathLevel = false;
    this.showRaidLevel = false;
    this.showIsChallengeMode = npc.isXerician;

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
}
