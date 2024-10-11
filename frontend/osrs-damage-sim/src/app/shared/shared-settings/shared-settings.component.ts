import { Component, OnInit } from '@angular/core';
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

  constructor(private sharedSettingsService: SharedSettingsService, private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.sharedSettingsService.prayers$.next(this.selectedPrayers);
    this.sharedSettingsService.statDrain$.next(this.statDrains);
    this.sharedSettingsService.combatStats$.next(this.combatStats);
    this.sharedSettingsService.boosts$.next(this.selectedBoosts);
    this.sharedSettingsService.trailblazerRelics$.next(this.trailblazerRelics);
    this.userSettingsWatch$ = this.localStorageService.userSettingsWatch$;
  }

  toggleBoost(boost: Boost): void {
    this.sharedSettingsService.toggleBoost(boost, this.selectedBoosts);
    this.sharedSettingsService.boosts$.next(this.selectedBoosts);
  }

  toggleAttackTypePrayer(prayer: Prayer, attackType: AttackType): void {
    this.sharedSettingsService.togglePrayer(prayer, this.selectedPrayers[attackType]);
    this.sharedSettingsService.prayers$.next(this.selectedPrayers);
  }

  combatStatsChanged(combatStats: CombatStats): void {
    this.sharedSettingsService.combatStats$.next(combatStats);
  }

  loadCombatStats(combatStats: CombatStats): void {
    this.combatStats = combatStats;
    this.sharedSettingsService.combatStats$.next(combatStats);
  }

  statDrainChanged(statDrains: StatDrain[]): void {
    this.sharedSettingsService.statDrain$.next(statDrains);
  }

  trailblazerRelicsChanged(relics: Set<TrailblazerRelic>): void {
    this.sharedSettingsService.trailblazerRelics$.next(relics);
  }

  attackCycleChanged(attackCycle: number): void {
    this.sharedSettingsService.attackCycle$.next(attackCycle);
  }
}
