import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Boost } from '../../model/osrs/boost.model';
import { GlobalSettings, InputSetup } from '../../model/damage-sim/input-setup.model';
import { Npc } from '../../model/osrs/npc.model';
import { Prayer } from 'src/app/model/osrs/prayer.model';
import { allAttackTypes, AttackType } from 'src/app/model/osrs/item.model';
import { CombatStats } from 'src/app/model/osrs/skill.type';
import { StatDrain } from 'src/app/model/damage-sim/stat-drain.model';
import { TOA_NPCS, TOA_PATH_LVL_NPCS } from 'src/app/shared/components/npc-input/npc.const';
import { InputSetupService } from 'src/app/services/input-setup.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Mode } from 'src/app/model/mode.enum';
import { TrailblazerRelic } from 'src/app/model/osrs/leagues/trailblazer-relics.model';
import { GlobalSettingsService } from 'src/app/services/global-settings.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { UserSettings } from 'src/app/model/damage-sim/user-settings.model';

@Component({
  selector: 'app-global-settings',
  templateUrl: './global-settings.component.html',
  styleUrls: ['./global-settings.component.css'],
})
export class GlobalSettingsComponent implements OnInit, OnDestroy {
  @Input()
  mode: Mode = Mode.DamageSim;

  Mode = Mode;

  globalSettings: GlobalSettings = {
    npc: null,
    iterations: 10000,
    teamSize: 1,
    raidLevel: 0,
    pathLevel: 0,
    isCoxChallengeMode: false,
    continuousSimSettings: {
      enabled: false,
      killCount: 100,
      deathCharge: false,
      respawnTicks: 0,
    },
    isDetailedRun: false,
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
  };

  statDrains: StatDrain[] = [];

  attackCycle = 0;

  trailblazerRelics: Set<TrailblazerRelic> = new Set();

  loading = false;

  userSettingsWatch$: Observable<UserSettings>;

  private destroyed$ = new Subject();

  constructor(
    private globalSettingsService: GlobalSettingsService,
    private inputSetupService: InputSetupService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.globalSettingsService.globalPrayers$.next(this.selectedPrayers);
    this.globalSettingsService.globalStatDrain$.next(this.statDrains);
    this.globalSettingsService.globalCombatStats$.next(this.combatStats);
    this.globalSettingsService.globalBoosts$.next(this.selectedBoosts);
    this.globalSettingsService.globalTrailblazerRelics$.next(this.trailblazerRelics);

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

    this.globalSettings.continuousSimSettings.respawnTicks = npc.respawn ?? 0;
  }

  toggleBoost(boost: Boost): void {
    this.globalSettingsService.toggleBoost(boost, this.selectedBoosts);
    this.globalSettingsService.globalBoosts$.next(this.selectedBoosts);
  }

  toggleAttackTypePrayer(prayer: Prayer, attackType: AttackType): void {
    this.globalSettingsService.togglePrayer(prayer, this.selectedPrayers[attackType]);
    this.globalSettingsService.globalPrayers$.next(this.selectedPrayers);
  }

  combatStatsChanged(combatStats: CombatStats): void {
    this.globalSettingsService.globalCombatStats$.next(combatStats);
  }

  loadCombatStats(combatStats: CombatStats): void {
    this.combatStats = combatStats;
    this.globalSettingsService.globalCombatStats$.next(combatStats);
  }

  statDrainChanged(statDrains: StatDrain[]): void {
    this.globalSettingsService.globalStatDrain$.next(statDrains);
  }

  onDetailedRunChanged(isDetailedRun: boolean): void {
    if (isDetailedRun) {
      this.globalSettings.iterations = Math.min(5000, this.globalSettings.iterations);
    }
  }

  trailblazerRelicsChanged(relics: Set<TrailblazerRelic>): void {
    this.globalSettingsService.globalTrailblazerRelics$.next(relics);
  }

  attackCycleChanged(attackCycle: number): void {
    this.globalSettingsService.globalAttackCycle$.next(attackCycle);
  }
}
