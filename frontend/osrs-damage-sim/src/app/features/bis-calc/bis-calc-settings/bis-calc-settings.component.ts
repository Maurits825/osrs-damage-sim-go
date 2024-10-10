import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BisCalcInputSetup } from 'src/app/model/damage-sim/bis-calc-input.model';
import { StatDrain } from 'src/app/model/damage-sim/stat-drain.model';
import { UserSettings } from 'src/app/model/damage-sim/user-settings.model';
import { Boost } from 'src/app/model/osrs/boost.model';
import { allAttackTypes, AttackType } from 'src/app/model/osrs/item.model';
import { Npc } from 'src/app/model/osrs/npc.model';
import { Prayer } from 'src/app/model/osrs/prayer.model';
import { CombatStats } from 'src/app/model/osrs/skill.type';
import { GlobalSettingsService } from 'src/app/services/global-settings.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { TOA_PATH_LVL_NPCS, TOA_NPCS } from 'src/app/shared/components/npc-input/npc.const';
import { DEFAULT_BIS_INPUT_SETUP } from './default-settings.const';
import { PartialDeep } from 'type-fest';
import { merge } from 'lodash-es';

@Component({
  selector: 'app-bis-calc-settings',
  templateUrl: './bis-calc-settings.component.html',
})
export class BisCalcSettingsComponent implements OnInit {
  @Output()
  bisCalcInputSetupChanged = new EventEmitter<BisCalcInputSetup>();

  bisCalcInputSetup$: BehaviorSubject<BisCalcInputSetup> = new BehaviorSubject(DEFAULT_BIS_INPUT_SETUP);

  showPathLevel = false;
  showRaidLevel = false;
  showIsChallengeMode = false;

  allAttackTypes = allAttackTypes;

  quickPrayers: Record<AttackType, Set<Prayer>> = {
    magic: new Set(['augury']),
    melee: new Set(['piety']),
    ranged: new Set(['rigour']),
  };

  loading = false;

  userSettingsWatch$: Observable<UserSettings>;

  constructor(private globalSettingsService: GlobalSettingsService, private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.userSettingsWatch$ = this.localStorageService.userSettingsWatch$;
    this.bisCalcInputSetup$.subscribe((setup) => this.bisCalcInputSetupChanged.emit(setup));
  }

  updateBisCalcInputSetup(update: PartialDeep<BisCalcInputSetup>): void {
    const setup = merge(this.bisCalcInputSetup$.getValue(), update);
    this.bisCalcInputSetup$.next(setup);
  }

  updateBisCalcInputSetupFn(update: (setup: BisCalcInputSetup) => void): void {
    const setup = this.bisCalcInputSetup$.getValue();
    update(setup);
    this.bisCalcInputSetup$.next(setup);
  }

  npcChanged(npc: Npc): void {
    this.updateBisCalcInputSetup({ globalSettings: { npc: npc } });

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
      this.updateBisCalcInputSetup({ globalSettings: { pathLevel: 0 } });
    } else {
      this.updateBisCalcInputSetup({ globalSettings: { pathLevel: 0, raidLevel: 0 } });
    }
  }

  toggleBoost(boost: Boost): void {
    const boosts = this.bisCalcInputSetup$.getValue().gearSetupSettings.boosts;
    this.globalSettingsService.toggleBoost(boost, boosts);
    this.updateBisCalcInputSetup({ gearSetupSettings: { boosts: boosts } });
  }

  toggleAttackTypePrayer(prayer: Prayer, attackType: AttackType): void {
    const prayers = this.bisCalcInputSetup$.getValue().prayers[attackType];
    this.globalSettingsService.togglePrayer(prayer, prayers);
    this.updateBisCalcInputSetupFn((setup: BisCalcInputSetup) => (setup.prayers[attackType] = prayers));
  }

  combatStatsChanged(combatStats: CombatStats): void {
    this.updateBisCalcInputSetup({ gearSetupSettings: { combatStats: combatStats } });
  }

  loadCombatStats(combatStats: CombatStats): void {
    this.updateBisCalcInputSetup({ gearSetupSettings: { combatStats: combatStats } });
  }

  statDrainChanged(statDrains: StatDrain[]): void {
    this.updateBisCalcInputSetup({ gearSetupSettings: { statDrains: statDrains } });
  }

  attackCycleChanged(attackCycle: number): void {
    this.updateBisCalcInputSetup({ gearSetupSettings: { attackCycle: attackCycle } });
  }
}
