import { Injectable } from '@angular/core';
import { GearSetup } from '../model/shared/gear-setup.model';

export type GearSetupsProvider = () => GearSetup[];

@Injectable({
  providedIn: 'root',
})
export class SimpleDmgSimInputService {
  public gearSetupsProvider: GearSetupsProvider;

  public setGearSetupsProvider(gearSetupsProvider: GearSetupsProvider) {
    this.gearSetupsProvider = gearSetupsProvider;
  }

  public getGearSetups(): GearSetup[] {
    return this.gearSetupsProvider();
  }
}
