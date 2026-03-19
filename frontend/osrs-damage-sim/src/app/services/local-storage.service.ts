import { Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { BehaviorSubject, Observable, iif, map, mergeMap, of, shareReplay, switchMap, tap } from 'rxjs';
import { GearSetupPreset } from '../model/shared/gear-preset.model';
import { GearSlot } from '../model/osrs/gear-slot.enum';
import { DEFAULT_USER_SETTINGS, UserSettings } from '../model/shared/user-settings.model';
import { GearSetup } from '../model/shared/gear-setup.model';
import { InputGearSetup, InputGearSetupPreset } from '../model/dps-calc/input-setup.model';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  public gearSetupWatch$: Observable<GearSetupPreset[]>;
  public inputPresetWatch$: Observable<InputGearSetupPreset[]>;
  public userSettingsWatch$: Observable<UserSettings>;
  public userSettings$: BehaviorSubject<UserSettings> = new BehaviorSubject<UserSettings>(DEFAULT_USER_SETTINGS);

  private gearSetupKey = 'gearSetup';
  private inputPresetKey = 'inputPreset';
  private userSettingsKey = 'userSettings';

  constructor(private storage: StorageMap) {
    this.gearSetupWatch$ = this.storage.watch(this.gearSetupKey).pipe(
      map((gearSetups) => gearSetups ?? []),
      map((gearSetups) => gearSetups as GearSetupPreset[]),
      shareReplay(1),
    );

    this.inputPresetWatch$ = this.storage.watch(this.inputPresetKey).pipe(
      map((presets) => presets ?? []),
      map((presets) => presets as InputGearSetupPreset[]),
      shareReplay(1),
    );

    this.userSettingsWatch$ = this.storage.watch(this.userSettingsKey).pipe(
      map((userSettings) => (userSettings === undefined ? DEFAULT_USER_SETTINGS : (userSettings as UserSettings))),
      tap((userSettings) => this.userSettings$.next(userSettings)),
      shareReplay(1),
    );
  }

  public saveGearSetup(gearSetup: GearSetup): Observable<string> {
    const error = this.validatedGearSetup(gearSetup);
    if (error) return of(error);

    const gearSetupPreset = this.createGearSetupPreset(gearSetup);

    return this.getKeyList<GearSetupPreset>(this.gearSetupKey).pipe(
      map(this.nameFilter<GearSetupPreset>(gearSetupPreset.name)),
      switchMap((gearSetups: GearSetupPreset[]) =>
        this.storage.set(this.gearSetupKey, [...gearSetups, gearSetupPreset]),
      ),
    );
  }

  public saveInputPreset(preset: InputGearSetupPreset): Observable<string> {
    const error = this.validatedInputPreset(preset);
    if (error) return of(error);

    return this.getKeyList<InputGearSetupPreset>(this.inputPresetKey).pipe(
      map(this.nameFilter<InputGearSetupPreset>(preset.name)),
      switchMap((presets: InputGearSetupPreset[]) => this.storage.set(this.inputPresetKey, [...presets, preset])),
    );
  }

  public deleteGearSetup(setupName: string): void {
    this.getKeyList<GearSetupPreset>(this.gearSetupKey)
      .pipe(
        map(this.nameFilter<GearSetupPreset>(setupName)),
        switchMap((gearSetups: GearSetupPreset[]) => this.storage.set(this.gearSetupKey, gearSetups)),
      )
      .subscribe();
  }

  public deleteInputPreset(setupName: string): void {
    this.getKeyList<InputGearSetupPreset>(this.inputPresetKey)
      .pipe(
        map(this.nameFilter<InputGearSetupPreset>(setupName)),
        switchMap((presets: InputGearSetupPreset[]) => this.storage.set(this.inputPresetKey, presets)),
      )
      .subscribe();
  }

  public deleteAllGearSetups(): void {
    this.storage.set(this.gearSetupKey, []).subscribe();
  }

  public deleteAllInputPresets(): void {
    this.storage.set(this.inputPresetKey, []).subscribe();
  }

  public saveUserSettings(userSettings: UserSettings): void {
    this.storage.set(this.userSettingsKey, userSettings).subscribe();
  }

  private nameFilter<T extends { name: string }>(filterName: string) {
    return (items: T[]): T[] => items.filter((item) => item.name !== filterName);
  }

  private getKeyList<T>(key: string): Observable<T[]> {
    return this.storage.get(key).pipe(
      map((arr) => arr ?? []),
      map((arr) => arr as T[]),
    );
  }

  private validatedGearSetup(gearSetup: GearSetup): string | null {
    if (!gearSetup.setupName) return 'Empty setup name';
    if (!Object.values(gearSetup.gear).some((item) => !!item)) return 'No gear selected';

    return null;
  }

  private validatedInputPreset(preset: InputGearSetupPreset): string | null {
    if (!preset.name) return 'Empty preset name';
    if (preset.inputGearSetups.length == 0) return 'No setups';

    for (let i = 0; i < preset.inputGearSetups.length; i++) {
      const error = this.validatedGearSetup(preset.inputGearSetups[i].gearSetup);
      if (error) return 'Setup ' + +(i + 1) + ': ' + error;
    }

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
      blowpipeDarts: gearSetup.blowpipeDarts.id,
    };
  }
}
