import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, skip } from 'rxjs';
import { GearSetupSettings } from 'src/app/model/damage-sim/input-setup.model';
import { StatDrain } from 'src/app/model/damage-sim/stat-drain.model';
import { Boost } from 'src/app/model/osrs/boost.model';
import { CombatStats } from 'src/app/model/osrs/skill.type';
import { BoostService } from 'src/app/services/boost.service';
import { CombatStatService } from 'src/app/services/combat-stat.service';
import { StatDrainService } from 'src/app/services/stat-drain.service';

@Component({
  selector: 'app-gear-setup-settings',
  templateUrl: './gear-setup-settings.component.html',
  styleUrls: ['./gear-setup-settings.component.css'],
})
export class GearSetupSettingsComponent implements OnInit, OnDestroy {
  public gearSetupSettings: GearSetupSettings = {
    statDrains: null,
    boosts: null,
    combatStats: null,
  };

  private subscriptions: Subscription = new Subscription();

  constructor(
    private boostService: BoostService,
    private statDrainService: StatDrainService,
    private combatStatService: CombatStatService
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.boostService.globalBoosts$.subscribe(
        (boosts: Set<Boost>) => (this.gearSetupSettings.boosts = new Set(boosts))
      )
    );

    this.subscriptions.add(
      this.statDrainService.globalStatDrain$.subscribe(
        (statDrains: StatDrain[]) => (this.gearSetupSettings.statDrains = [...statDrains])
      )
    );

    this.subscriptions.add(
      this.combatStatService.globalCombatStats$.subscribe(
        (combatStats: CombatStats) => (this.gearSetupSettings.combatStats = { ...combatStats })
      )
    );
  }

  toggleBoost(boost: Boost): void {
    this.boostService.toggleBoost(boost, this.gearSetupSettings.boosts);
  }

  statDrainsChanged(statDrains: StatDrain[]): void {
    this.gearSetupSettings.statDrains = statDrains;
  }

  combatStatsChanged(combatStats: CombatStats): void {
    this.gearSetupSettings.combatStats = { ...combatStats };
  }
}
