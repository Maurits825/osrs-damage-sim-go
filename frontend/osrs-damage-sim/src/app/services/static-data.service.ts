import { Injectable } from '@angular/core';
import { Observable, map, shareReplay, take, tap } from 'rxjs';
import { GearSetupPreset } from '../model/shared/gear-preset.model';
import { QuickGear, QuickGearSlots } from '../model/shared/quick-gear.model';
import { GearSlot } from '../model/osrs/gear-slot.enum';
import { allAttackTypes, Item } from '../model/osrs/item.model';
import { Npc } from '../model/osrs/npc.model';
import { HttpClient } from '@angular/common/http';
import { ExampleSetup } from '../model/dps-calc/example-setup.model';
import { InputSetup as SimpleSimInputSetup } from '../model/simple-dmg-sim/input-setup.model';
import { quickGearSetups } from './quick-gear.const';

@Injectable({
  providedIn: 'root',
})
export class StaticDataService {
  public allGearSlotItems$: Observable<Record<GearSlot, Item[]>>;
  public gearSetupPresets$: Observable<GearSetupPreset[]>;

  public DpsCalcExampleSetups$: Observable<ExampleSetup<string>[]>;
  public SimpleSimExampleSetups$: Observable<ExampleSetup<SimpleSimInputSetup>[]>;
  public abbreviations$: Observable<Record<string, string[]>>;

  public allSpells$: Observable<string[]>;
  public allNpcs$: Observable<Npc[]>;
  public allDarts$: Observable<Item[]>;

  private allGearSlotItems: Record<GearSlot, Item[]>;

  constructor(private http: HttpClient) {
    this.allGearSlotItems$ = this.getGearSlotItems().pipe(
      map((gearSlotItems: Record<GearSlot, Item[]>) => {
        Object.keys(gearSlotItems).forEach((gearSlot: string) => {
          gearSlotItems[gearSlot as GearSlot].sort((item1: Item, item2: Item) => item1.name.localeCompare(item2.name));
        });
        return gearSlotItems;
      }),
      shareReplay(1),
    );

    this.allGearSlotItems$.pipe(take(1)).subscribe((items) => (this.allGearSlotItems = items));

    this.gearSetupPresets$ = this.getGearSetupPresets().pipe(shareReplay(1));

    this.DpsCalcExampleSetups$ = this.getExampleSetups<string>('dps_calc_example_setups.json').pipe(shareReplay(1));
    this.SimpleSimExampleSetups$ = this.getExampleSetups<SimpleSimInputSetup>('simple_sim_example_setups.json').pipe(
      shareReplay(1),
    );
    this.abbreviations$ = this.getAbbreviations().pipe(shareReplay(1));

    this.allSpells$ = this.getSpells().pipe(shareReplay(1));
    this.allNpcs$ = this.getNpcs().pipe(shareReplay(1));
    this.allDarts$ = this.getDarts().pipe(shareReplay(1));
  }

  private getGearSlotItems(): Observable<Record<GearSlot, Item[]>> {
    return this.http.get<Record<GearSlot, Item[]>>('assets/json_data/gear_slot_items.json');
  }

  private getSpells(): Observable<string[]> {
    return this.http.get<Record<string, number>>('assets/json_data/magic_spells.json').pipe(
      map((spells: Record<string, number>) => spells['all_spells']),
      map((obj) => Object.keys(obj)),
    );
  }

  private getNpcs(): Observable<Npc[]> {
    return this.http.get<Npc[]>('assets/json_data/unique_npcs.json');
  }

  private getGearSetupPresets(): Observable<GearSetupPreset[]> {
    return this.http.get<GearSetupPreset[]>('assets/json_data/gear_setup_presets.json');
  }

  private getExampleSetups<T>(jsonName: string): Observable<ExampleSetup<T>[]> {
    return this.http.get<ExampleSetup<T>[]>('assets/json_data/' + jsonName);
  }

  private getAbbreviations(): Observable<Record<string, string[]>> {
    return this.http.get<Record<string, string[]>>('assets/json_data/abbreviations.json');
  }

  private getDarts(): Observable<Item[]> {
    return this.allGearSlotItems$.pipe(
      map((gearSlotItem: Record<GearSlot, Item[]>) =>
        gearSlotItem[GearSlot.Weapon].filter((item: Item) => item.name.match('dart$')),
      ),
    );
  }

  public getItem(slot: GearSlot, itemId: number): Item {
    return this.allGearSlotItems[slot].find((item: Item) => item.id === itemId);
  }

  public getQuickGearSlots(): QuickGearSlots {
    const quickGearSlots: QuickGearSlots = {} as QuickGearSlots;
    for (const gs in GearSlot) {
      const slot = GearSlot[gs as keyof typeof GearSlot] as keyof QuickGearSlots;
      quickGearSlots[slot] = {} as QuickGear;
      for (const attackIdx in allAttackTypes) {
        const items: Item[] = [];
        const attackType = allAttackTypes[attackIdx];
        for (const itemId of quickGearSetups[slot][attackType]) {
          const item = this.getItem(slot, itemId);
          items.push(item);
        }
        quickGearSlots[slot][attackType] = items;
      }
    }
    return quickGearSlots;
  }
}
