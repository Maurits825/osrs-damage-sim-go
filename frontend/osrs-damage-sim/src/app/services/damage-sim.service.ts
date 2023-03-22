import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DamageSimResults } from '../model/damage-sim/damage-sim-results.model';
import { ExampleSetup } from '../model/damage-sim/example-setup.model';
import { GearSetupPreset } from '../model/damage-sim/gear-preset.model';
import { InputSetup } from '../model/damage-sim/input-setup.model';
import { GearSlot } from '../model/osrs/gear-slot.enum';
import { Item } from '../model/osrs/item.model';
import { Npc } from '../model/osrs/npc.model';

@Injectable({
  providedIn: 'root',
})
export class DamageSimService {
  public allGearSlotItems$: Observable<Record<GearSlot, Item[]>>;
  public gearSetupPresets$: Observable<GearSetupPreset[]>;

  public exampleSetups$: Observable<ExampleSetup[]>;

  public allSpells$: Observable<string[]>;
  public allNpcs$: Observable<Npc[]>;
  public allDarts$: Observable<Item[]>;

  private damageSimServiceUrl = environment.OSRS_DAMAGE_SIM_SERVICE_URL;

  constructor(private http: HttpClient) {
    this.allGearSlotItems$ = this.getGearSlotItems().pipe(
      map((gearSlotItems: Record<GearSlot, Item[]>) => {
        Object.keys(gearSlotItems).forEach((gearSlot: string) => {
          gearSlotItems[gearSlot as GearSlot].sort((item1: Item, item2: Item) => item1.name.localeCompare(item2.name));
        });
        return gearSlotItems;
      }),
      shareReplay(1)
    );

    this.gearSetupPresets$ = this.getGearSetupPresets().pipe(
      map((presets: GearSetupPreset[]) =>
        presets.sort((a: GearSetupPreset, b: GearSetupPreset) => a.name.localeCompare(b.name))
      ),
      shareReplay(1)
    );

    this.exampleSetups$ = this.getExampleSetups().pipe(shareReplay(1));

    this.allSpells$ = this.getSpells().pipe(shareReplay(1));
    this.allNpcs$ = this.getNpcs().pipe(shareReplay(1));
    this.allDarts$ = this.getDarts().pipe(shareReplay(1));
  }

  public getStatus(): Observable<string> {
    return this.http.get<string>(this.damageSimServiceUrl + '/status');
  }

  public runDamageSim(inputSetupJson: string): Observable<DamageSimResults> {
    const options = { headers: { 'Content-Type': 'application/json' } };
    return this.http.post<DamageSimResults>(this.damageSimServiceUrl + '/run-damage-sim', inputSetupJson, options);
  }

  private getGearSlotItems(): Observable<Record<GearSlot, Item[]>> {
    return this.http.get<Record<GearSlot, Item[]>>('assets/json_data/gear_slot_items.json');
  }

  private getSpells(): Observable<string[]> {
    return this.http.get<Record<string, number>>('assets/json_data/magic_spells.json').pipe(
      map((spells: Record<string, number>) => spells['all_spells']),
      map((obj) => Object.keys(obj))
    );
  }

  private getNpcs(): Observable<Npc[]> {
    return this.http.get<Npc[]>('assets/json_data/unique_npcs.json');
  }

  private getGearSetupPresets(): Observable<GearSetupPreset[]> {
    return this.http.get<GearSetupPreset[]>('assets/json_data/gear_setup_presets.json');
  }

  private getDarts(): Observable<Item[]> {
    return this.allGearSlotItems$.pipe(
      map((gearSlotItem: Record<GearSlot, Item[]>) =>
        gearSlotItem[GearSlot.Weapon].filter((item: Item) => item.name.match('dart$'))
      )
    );
  }

  private getExampleSetups(): Observable<ExampleSetup[]> {
    return this.http.get<ExampleSetup[]>('assets/json_data/example_setups.json');
  }
}
