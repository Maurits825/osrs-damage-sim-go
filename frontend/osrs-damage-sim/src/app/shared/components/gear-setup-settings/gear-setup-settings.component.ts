import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { takeUntil, Subject, Observable, skip } from 'rxjs';
import { StatDrain } from 'src/app/model/shared/stat-drain.model';
import { UserSettings } from 'src/app/model/shared/user-settings.model';
import { Boost } from 'src/app/model/osrs/boost.model';
import { TrailblazerRelic } from 'src/app/model/osrs/leagues/trailblazer-relics.model';
import { CombatStats } from 'src/app/model/osrs/skill.type';
import { SharedSettingsService } from 'src/app/services/shared-settings.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { DEFAULT_GEAR_SETUP_SETTINGS, GearSetupSettings } from 'src/app/model/shared/gear-setup-settings.model';
import { cloneDeep } from 'lodash-es';
import { RagingEchoesSettings } from 'src/app/model/osrs/leagues/raging-echoes.model';

@Component({
  selector: 'app-gear-setup-settings',
  templateUrl: './gear-setup-settings.component.html',
})
export class GearSetupSettingsComponent implements OnInit, OnDestroy {
  @Input()
  gearSetupSettings: GearSetupSettings | null;

  @Output()
  gearSetupSettingsChange = new EventEmitter<GearSetupSettings>();

  userSettingsWatch$: Observable<UserSettings>;

  private destroyed$ = new Subject();

  constructor(private sharedSettingsService: SharedSettingsService, private localStorageService: LocalStorageService) {}

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  ngOnInit(): void {
    const skipCount = this.gearSetupSettings === null ? 0 : 1;
    if (this.gearSetupSettings === null) {
      this.gearSetupSettings = cloneDeep(DEFAULT_GEAR_SETUP_SETTINGS);
      this.gearSetupSettingsChange.emit(this.gearSetupSettings);
    }

    this.sharedSettingsService.boosts$
      .pipe(takeUntil(this.destroyed$), skip(skipCount))
      .subscribe((boosts: Set<Boost>) => (this.gearSetupSettings.boosts = new Set(boosts)));

    this.sharedSettingsService.statDrain$
      .pipe(takeUntil(this.destroyed$), skip(skipCount))
      .subscribe((statDrains: StatDrain[]) => (this.gearSetupSettings.statDrains = cloneDeep(statDrains)));

    this.sharedSettingsService.combatStats$
      .pipe(takeUntil(this.destroyed$), skip(skipCount))
      .subscribe((combatStats: CombatStats) => (this.gearSetupSettings.combatStats = { ...combatStats }));

    this.sharedSettingsService.trailblazerRelics$
      .pipe(takeUntil(this.destroyed$), skip(skipCount))
      .subscribe((relics: Set<TrailblazerRelic>) => (this.gearSetupSettings.trailblazerRelics = new Set(relics)));

    this.sharedSettingsService.ragingEchoesSettings$
      .pipe(takeUntil(this.destroyed$), skip(skipCount))
      .subscribe(
        (settings: RagingEchoesSettings) => (this.gearSetupSettings.ragingEchoesSettings = cloneDeep(settings))
      );

    this.sharedSettingsService.attackCycle$
      .pipe(takeUntil(this.destroyed$), skip(skipCount))
      .subscribe((attackCycle: number) => (this.gearSetupSettings.attackCycle = attackCycle));

    this.userSettingsWatch$ = this.localStorageService.userSettingsWatch$;
  }

  toggleBoost(boost: Boost): void {
    this.sharedSettingsService.toggleBoost(boost, this.gearSetupSettings.boosts);
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

  ragingEchoesSettingsChanged(settings: RagingEchoesSettings): void {
    this.gearSetupSettings.ragingEchoesSettings = settings;
  }

  attackCycleChanged(attackCycle: number): void {
    this.gearSetupSettings.attackCycle = attackCycle;
  }
}
