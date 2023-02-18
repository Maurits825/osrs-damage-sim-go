import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, skip } from 'rxjs';
import { GearSetupSettings } from 'src/app/model/damage-sim/input-setup.model';
import { StatDrain } from 'src/app/model/damage-sim/stat-drain.model';
import { Boost } from 'src/app/model/osrs/boost.model';
import { CombatStats } from 'src/app/model/osrs/skill.type';
import { BoostService } from 'src/app/services/boost.service';
import { CombatStatService } from 'src/app/services/combat-stat.service';

@Component({
  selector: 'app-gear-setup-settings',
  templateUrl: './gear-setup-settings.component.html',
  styleUrls: ['./gear-setup-settings.component.css'],
})
export class GearSetupSettingsComponent implements OnInit, OnDestroy {
  public gearSetupSettings: GearSetupSettings = {
    statDrains: [],
    boosts: new Set<Boost>(),
  };

  statDrains: StatDrain[] = [];
  private subscriptions: Subscription = new Subscription();

  constructor(private boostService: BoostService) {}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnInit(): void {
    this.gearSetupSettings.boosts = new Set(this.boostService.globalBoosts$.getValue());

    this.subscriptions.add(
      this.boostService.globalBoosts$
        .pipe(skip(1))
        .subscribe((boosts: Set<Boost>) => (this.gearSetupSettings.boosts = new Set(boosts)))
    );
  }

  toggleBoost(boost: Boost): void {
    this.boostService.toggleBoost(boost, this.gearSetupSettings.boosts);
  }

  statDrainChanged(statDrain: StatDrain[]): void {}
}
