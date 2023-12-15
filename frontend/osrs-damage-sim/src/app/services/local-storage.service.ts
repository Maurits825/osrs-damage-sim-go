import { Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Observable, filter, iif, map, mergeMap, of, shareReplay, switchMap } from 'rxjs';
import { GearSetupPreset } from '../model/damage-sim/gear-preset.model';
import { GearSetup } from '../model/damage-sim/input-setup.model';
import { GearSlot } from '../model/osrs/gear-slot.enum';
import { DEFAULT_USER_SETTINGS, UserSettings } from '../model/damage-sim/user-settings.model';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  public gearSetupWatch$: Observable<GearSetupPreset[]>;
  public userSettingsWatch$: Observable<UserSettings>;

  private gearSetupKey = 'gearSetup';
  private userSettingsKey = 'userSettings';

  constructor(private storage: StorageMap) {
    this.gearSetupWatch$ = this.storage.watch(this.gearSetupKey).pipe(
      filter((gearSetup) => gearSetup !== undefined),
      map((gearSetup) => gearSetup as GearSetupPreset[]),
      shareReplay(1)
    );

    this.userSettingsWatch$ = this.storage.watch(this.userSettingsKey).pipe(
      map((userSettings) => (userSettings === undefined ? DEFAULT_USER_SETTINGS : (userSettings as UserSettings))),
      shareReplay(1)
    );
  }

  public saveGearSetup(gearSetup: GearSetup): Observable<string> {
    const error = this.validatedGearSetup(gearSetup);
    if (error) return of(error);

    const gearSetupPreset = this.createGearSetupPreset(gearSetup);
    return this.getSavedGearSetups().pipe(
      mergeMap((gearSetups: GearSetupPreset[]) =>
        iif(
          () => gearSetups.some((preset: GearSetupPreset) => preset.name === gearSetupPreset.name),
          of('Name already exists'),
          this.storage.set(this.gearSetupKey, [...gearSetups, gearSetupPreset])
        )
      )
    );
  }

  public deleteGearSetup(setupName: string): void {
    this.getSavedGearSetups()
      .pipe(
        map((gearSetups: GearSetupPreset[]) =>
          gearSetups.filter((gearSetup: GearSetupPreset) => gearSetup.name !== setupName)
        ),
        switchMap((gearSetups: GearSetupPreset[]) => this.storage.set(this.gearSetupKey, gearSetups))
      )
      .subscribe();
  }

  public deleteAllGearSetups(): void {
    this.storage.set(this.gearSetupKey, []).subscribe();
  }

  public saveUserSettings(userSettings: UserSettings): void {
    this.storage.set(this.userSettingsKey, userSettings).subscribe();
  }

  private getSavedGearSetups(): Observable<GearSetupPreset[]> {
    return this.storage.get(this.gearSetupKey).pipe(
      map((gearSetups) => gearSetups ?? []),
      map((gearSetups) => gearSetups as GearSetupPreset[])
    );
  }

  private validatedGearSetup(gearSetup: GearSetup): string | null {
    if (!gearSetup.setupName) return 'Empty setup name';
    if (!Object.values(gearSetup.gear).some((item) => !!item)) return 'No gear selected';

    return null;
  }

  private createGearSetupPreset(gearSetup: GearSetup): GearSetupPreset {
    const gearIds = [];

    for (const slot in gearSetup.gear) {
      const item = gearSetup.gear[slot as GearSlot];
      if (item && item.id) gearIds.push(item.id);
    }

    return {
      isDefault: false,
      name: gearSetup.setupName,
      gearIds: gearIds,
      icon: gearSetup.gear[GearSlot.Weapon]?.icon ?? Object.values(gearSetup.gear).find((item) => !!item).icon,
      attackType: gearSetup.gear[GearSlot.Weapon]?.attackType ?? 'melee',
      attackStyle: gearSetup.attackStyle,
      spell: gearSetup.spell,
    };
  }
}
