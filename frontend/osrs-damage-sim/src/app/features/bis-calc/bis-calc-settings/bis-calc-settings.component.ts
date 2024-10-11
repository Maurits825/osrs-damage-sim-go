import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StatDrain } from 'src/app/model/shared/stat-drain.model';
import { UserSettings } from 'src/app/model/shared/user-settings.model';
import { Boost } from 'src/app/model/osrs/boost.model';
import { allAttackTypes, AttackType } from 'src/app/model/osrs/item.model';
import { NpcInfo } from 'src/app/model/osrs/npc.model';
import { Prayer } from 'src/app/model/osrs/prayer.model';
import { CombatStats } from 'src/app/model/osrs/skill.type';
import { SharedSettingsService } from 'src/app/services/shared-settings.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { DEFAULT_BIS_INPUT_SETUP } from './default-settings.const';
import { PartialDeep } from 'type-fest';
import { merge } from 'lodash-es';
import { BisCalcInputSetup } from 'src/app/model/bis-calc/bis-calc-input.model';
import { mapGlobalSettingsToNpcInfo, mapNpcInfoToGlobalSettings } from 'src/app/helpers/data-mapping.helper';

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

  //todo kinda scuffed having to do this here
  npcInfo: NpcInfo = mapGlobalSettingsToNpcInfo(DEFAULT_BIS_INPUT_SETUP.globalSettings);

  userSettingsWatch$: Observable<UserSettings>;

  constructor(private sharedSettingsService: SharedSettingsService, private localStorageService: LocalStorageService) {}

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

  npcInfoChanged(npcInfo: NpcInfo): void {
    this.updateBisCalcInputSetup({
      globalSettings: mapNpcInfoToGlobalSettings(npcInfo),
    });
  }

  toggleBoost(boost: Boost): void {
    const boosts = this.bisCalcInputSetup$.getValue().gearSetupSettings.boosts;
    this.sharedSettingsService.toggleBoost(boost, boosts);
    this.updateBisCalcInputSetup({ gearSetupSettings: { boosts: boosts } });
  }

  toggleAttackTypePrayer(prayer: Prayer, attackType: AttackType): void {
    const prayers = this.bisCalcInputSetup$.getValue().prayers[attackType];
    this.sharedSettingsService.togglePrayer(prayer, prayers);
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
