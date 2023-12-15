import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntil, Subject } from 'rxjs';
import { GearSetupSettings } from 'src/app/model/damage-sim/input-setup.model';
import { StatDrain } from 'src/app/model/damage-sim/stat-drain.model';
import { Boost } from 'src/app/model/osrs/boost.model';
import { TrailblazerRelic } from 'src/app/model/osrs/leagues/trailblazer-relics.model';
import { CombatStats } from 'src/app/model/osrs/skill.type';
import { GlobalSettingsService } from 'src/app/services/global-settings.service';

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

    attackCycle: 0,

    trailblazerRelics: null,
  };

  private destroyed$ = new Subject();

  constructor(private globalSettingsService: GlobalSettingsService) {}

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  ngOnInit(): void {
    this.globalSettingsService.globalBoosts$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((boosts: Set<Boost>) => (this.gearSetupSettings.boosts = new Set(boosts)));

    this.globalSettingsService.globalStatDrain$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((statDrains: StatDrain[]) => (this.gearSetupSettings.statDrains = [...statDrains]));

    this.globalSettingsService.globalCombatStats$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((combatStats: CombatStats) => (this.gearSetupSettings.combatStats = { ...combatStats }));

    this.globalSettingsService.globalTrailblazerRelics$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((relics: Set<TrailblazerRelic>) => (this.gearSetupSettings.trailblazerRelics = new Set(relics)));

    this.globalSettingsService.globalAttackCycle$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((attackCycle: number) => (this.gearSetupSettings.attackCycle = attackCycle));
  }

  toggleBoost(boost: Boost): void {
    this.globalSettingsService.toggleBoost(boost, this.gearSetupSettings.boosts);
  }

  statDrainsChanged(statDrains: StatDrain[]): void {
    this.gearSetupSettings.statDrains = statDrains;
  }

  combatStatsChanged(combatStats: CombatStats): void {
    this.gearSetupSettings.combatStats = { ...combatStats };
  }

  trailblazerRelicsChanged(relics: Set<TrailblazerRelic>): void {
    this.gearSetupSettings.trailblazerRelics = relics;
  }

  attackCycleChanged(attackCycle: number): void {
    this.gearSetupSettings.attackCycle = attackCycle;
  }
}
