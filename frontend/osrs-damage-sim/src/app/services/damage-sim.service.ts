import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ItemsList } from '@ng-select/ng-select/lib/items-list';
import { filter } from 'lodash-es';
import { map, Observable, shareReplay } from 'rxjs';
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
  public allGearSlotItems$: Observable<Record<GearSlot, Item[]>>;
  public gearSetupPresets$: Observable<Record<string, Record<GearSlot, number>>>;
  public allSpells$: Observable<string[]>;
  public allNpcs$: Observable<Npc[]>;
  public allDarts$: Observable<Item[]>;

  constructor(private http: HttpClient) {
    this.allGearSlotItems$ = this.getGearSlotItems().pipe(shareReplay(1));
    this.gearSetupPresets$ = this.getGearSetupPresets().pipe(shareReplay(1));
    this.allSpells$ = this.getSpells().pipe(shareReplay(1));
    this.allNpcs$ = this.getNpcs().pipe(shareReplay(1));
    this.allDarts$ = this.getDarts().pipe(shareReplay(1));
  }

  public getStatus(): Observable<string> {
    console.log('Getting status');
    return this.http.get<string>(DAMAGE_SIM_SERVER_URL + '/status');
  }

  public runDamageSim(inputSetup: InputSetup): Observable<DamageSimResults> {
    const options = { headers: { 'Content-Type': 'application/json' } };
    return this.http.post<DamageSimResults>(
      DAMAGE_SIM_SERVER_URL + '/run-damage-sim',
      this.convertInputSetupToJson(inputSetup),
      options
    );
  }

  private getGearSlotItems(): Observable<Record<GearSlot, Item[]>> {
    return this.http.get<Record<GearSlot, Item[]>>(DAMAGE_SIM_SERVER_URL + '/gear-slot-items');
  }

  private getSpells(): Observable<string[]> {
    return this.http.get<Object>(DAMAGE_SIM_SERVER_URL + '/all-spells').pipe(map((obj) => Object.keys(obj)));
  }

  private getNpcs(): Observable<Npc[]> {
    return this.http.get<Npc[]>(DAMAGE_SIM_SERVER_URL + '/npcs');
  }

  private getGearSetupPresets(): Observable<Record<string, Record<GearSlot, number>>> {
    return this.http.get<Record<string, Record<GearSlot, number>>>(DAMAGE_SIM_SERVER_URL + '/gear-setup-presets');
  }

  private getDarts(): Observable<Item[]> {
    return this.allGearSlotItems$.pipe(
      map((gearSlotItem: Record<GearSlot, Item[]>) =>
        gearSlotItem[GearSlot.Weapon].filter((item: Item) => item.name.match('dart$'))
      )
    );
  }

  private convertInputSetupToJson(inputSetup: InputSetup): string {
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
