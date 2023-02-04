import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { DAMAGE_SIM_SERVER_URL } from '../constants.const';
import { DamageSimResults } from '../model/damage-sim-results.model';
import { GearSlot } from '../model/gear-slot.enum';
import { InputSetup } from '../model/input-setup.model';
import { Item } from '../model/item.model';
import { Npc } from '../model/npc.model';
import { FILTER_PATHS } from './filter-fields.const';

@Injectable({
  providedIn: 'root',
})
export class DamageSimService {
  constructor(private http: HttpClient) {}

  getStatus(): Observable<string> {
    console.log('Getting status');
    return this.http.get<string>(DAMAGE_SIM_SERVER_URL + '/status');
  }

  getGearSlotItems(): Observable<Record<GearSlot, Item[]>> {
    return this.http.get<Record<GearSlot, Item[]>>(DAMAGE_SIM_SERVER_URL + '/gear-slot-items');
  }

  getAllSpells(): Observable<string[]> {
    return this.http.get<Object>(DAMAGE_SIM_SERVER_URL + '/all-spells').pipe(map((obj) => Object.keys(obj)));
  }

  getAllNpcs(): Observable<Npc[]> {
    return this.http.get<Npc[]>(DAMAGE_SIM_SERVER_URL + '/npcs');
  }

  runDamageSim(inputSetup: InputSetup): Observable<DamageSimResults> {
    const options = { headers: { 'Content-Type': 'application/json' } };
    return this.http.post<DamageSimResults>(
      DAMAGE_SIM_SERVER_URL + '/run-damage-sim',
      this.convertInputSetupToJson(inputSetup),
      options
    );
  }

  getGearSetupPresets(): Observable<Record<string, Record<GearSlot, number>>> {
    return this.http.get<Record<string, Record<GearSlot, number>>>(DAMAGE_SIM_SERVER_URL + '/gear-setup-presets');
  }

  convertInputSetupToJson(inputSetup: InputSetup): string {
    return JSON.stringify(inputSetup, (key, value) => {
      if (value instanceof Set) {
        return [...value];
      } else if (FILTER_PATHS.some((field) => key === field)) {
        return undefined;
      }

      return value;
    });
  }
}
