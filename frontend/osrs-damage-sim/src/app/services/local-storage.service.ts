import { Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Observable, filter, map, shareReplay, switchMap } from 'rxjs';
import { GearSetupPreset } from '../model/damage-sim/gear-preset.model';
import { GearSetup } from '../model/damage-sim/input-setup.model';
import { AttackType } from '../model/osrs/item.model';
import { GearSlot } from '../model/osrs/gear-slot.enum';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  public gearSetupWatch$: Observable<GearSetupPreset[]>;

  private gearSetupKey = 'gearSetup';

  constructor(private storage: StorageMap) {
    this.storage.get(this.gearSetupKey).subscribe((gearSetup) => {
      console.log('stored gearSetups:', gearSetup);
    });

    this.gearSetupWatch$ = this.storage.watch(this.gearSetupKey).pipe(
      map((gearSetup) => gearSetup as GearSetupPreset[]),
      filter((gearSetup) => gearSetup !== undefined),
      shareReplay(1)
    );
  }

  public saveGearSetup(gearSetup: GearSetup): void {
    const gearSetupPreset = this.createGearSetupPreset(gearSetup);
    this.storage
      .get(this.gearSetupKey)
      .pipe(
        map((gearSetups) => gearSetups ?? []),
        map((gearSetups) => gearSetups as GearSetupPreset[]),
        map((gearSetups: GearSetupPreset[]) => [...gearSetups, gearSetupPreset]),
        switchMap((gearSetups: GearSetupPreset[]) => this.storage.set(this.gearSetupKey, gearSetups))
      )
      .subscribe();
  }

  private createGearSetupPreset(gearSetup: GearSetup): GearSetupPreset {
    const gearIds = [];

    for (const slot in gearSetup.gear) {
      const item = gearSetup.gear[slot as GearSlot];
      if (item && item.id) gearIds.push(item.id);
    }

    return {
      name: gearSetup.setupName,
      gearIds: gearIds,
      icon: gearSetup.gear[GearSlot.Weapon].icon,
      attackType: gearSetup.gear[GearSlot.Weapon].attackType,
    };
  }
}
