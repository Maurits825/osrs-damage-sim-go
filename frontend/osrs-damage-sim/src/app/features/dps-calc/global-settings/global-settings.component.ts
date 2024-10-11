import { Component, OnDestroy, OnInit } from '@angular/core';
import { Prayer } from 'src/app/model/osrs/prayer.model';
import { allAttackTypes, AttackType } from 'src/app/model/osrs/item.model';
import { CombatStats } from 'src/app/model/osrs/skill.type';
import { StatDrain } from 'src/app/model/shared/stat-drain.model';
import { TOA_NPCS, TOA_PATH_LVL_NPCS } from 'src/app/shared/components/npc-input/npc.const';
import { DpsCalcInputService } from 'src/app/services/dps-calc-input.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { TrailblazerRelic } from 'src/app/model/osrs/leagues/trailblazer-relics.model';
import { SharedSettingsService } from 'src/app/services/shared-settings.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UserSettings } from 'src/app/model/shared/user-settings.model';
import { GlobalSettings, InputSetup } from 'src/app/model/dps-calc/input-setup.model';
import { Boost } from 'src/app/model/osrs/boost.model';
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

  selectedBoosts: Set<Boost> = new Set();

  allAttackTypes = allAttackTypes;

  selectedPrayers: Record<AttackType, Set<Prayer>> = {
    magic: new Set(['augury']),
    melee: new Set(['piety']),
    ranged: new Set(['rigour']),
  };

  quickPrayers: Record<AttackType, Set<Prayer>> = {
    magic: new Set(['augury']),
    melee: new Set(['piety']),
    ranged: new Set(['rigour']),
  };

  combatStats: CombatStats = {
    attack: 99,
    strength: 99,
    ranged: 99,
    magic: 99,
    hitpoints: 99,
    defence: 99,
  };

  statDrains: StatDrain[] = [];

  attackCycle = 0;

  trailblazerRelics: Set<TrailblazerRelic> = new Set();

  loading = false;

  userSettingsWatch$: Observable<UserSettings>;

  private destroyed$ = new Subject();

  constructor(
    private globalSettingsService: SharedSettingsService,
    private inputSetupService: DpsCalcInputService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.globalSettingsService.prayers$.next(this.selectedPrayers);
    this.globalSettingsService.statDrain$.next(this.statDrains);
    this.globalSettingsService.combatStats$.next(this.combatStats);
    this.globalSettingsService.boosts$.next(this.selectedBoosts);
    this.globalSettingsService.trailblazerRelics$.next(this.trailblazerRelics);

    this.inputSetupService.loadInputSetup$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((inputSetup: InputSetup) => this.setGlobalSettings(inputSetup.globalSettings));

    this.inputSetupService.globalSettingsComponent$.next(this);

    this.userSettingsWatch$ = this.localStorageService.userSettingsWatch$;
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

  toggleBoost(boost: Boost): void {
    this.globalSettingsService.toggleBoost(boost, this.selectedBoosts);
    this.globalSettingsService.boosts$.next(this.selectedBoosts);
  }

  toggleAttackTypePrayer(prayer: Prayer, attackType: AttackType): void {
    this.globalSettingsService.togglePrayer(prayer, this.selectedPrayers[attackType]);
    this.globalSettingsService.prayers$.next(this.selectedPrayers);
  }

  combatStatsChanged(combatStats: CombatStats): void {
    this.globalSettingsService.combatStats$.next(combatStats);
  }

  loadCombatStats(combatStats: CombatStats): void {
    this.combatStats = combatStats;
    this.globalSettingsService.combatStats$.next(combatStats);
  }

  statDrainChanged(statDrains: StatDrain[]): void {
    this.globalSettingsService.statDrain$.next(statDrains);
  }

  trailblazerRelicsChanged(relics: Set<TrailblazerRelic>): void {
    this.globalSettingsService.trailblazerRelics$.next(relics);
  }

  attackCycleChanged(attackCycle: number): void {
    this.globalSettingsService.attackCycle$.next(attackCycle);
  }
}
