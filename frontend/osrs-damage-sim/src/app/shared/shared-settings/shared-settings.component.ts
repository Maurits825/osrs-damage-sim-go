import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Boost } from 'src/app/model/osrs/boost.model';
import { allAttackTypes, AttackType } from 'src/app/model/osrs/item.model';
import { TrailblazerRelic } from 'src/app/model/osrs/leagues/trailblazer-relics.model';
import { Prayer } from 'src/app/model/osrs/prayer.model';
import { CombatStats } from 'src/app/model/osrs/skill.type';
import { StatDrain } from 'src/app/model/shared/stat-drain.model';
import { UserSettings } from 'src/app/model/shared/user-settings.model';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { SharedSettingsService } from 'src/app/services/shared-settings.service';

@Component({
  selector: 'app-shared-settings',
  templateUrl: './shared-settings.component.html',
})
export class SharedSettingsComponent implements OnInit {
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

  userSettingsWatch$: Observable<UserSettings>;

  constructor(private globalSettingsService: SharedSettingsService, private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.globalSettingsService.prayers$.next(this.selectedPrayers);
    this.globalSettingsService.statDrain$.next(this.statDrains);
    this.globalSettingsService.combatStats$.next(this.combatStats);
    this.globalSettingsService.boosts$.next(this.selectedBoosts);
    this.globalSettingsService.trailblazerRelics$.next(this.trailblazerRelics);
    this.userSettingsWatch$ = this.localStorageService.userSettingsWatch$;
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
