import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable, shareReplay } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DpsResults } from '../model/damage-sim/dps-results.model';
import { ExampleSetup } from '../model/damage-sim/example-setup.model';
import { GearSetupPreset } from '../model/damage-sim/gear-preset.model';
import { GearSlot } from '../model/osrs/gear-slot.enum';
import { allAttackTypes, AttackType, Item } from '../model/osrs/item.model';
import { Npc } from '../model/osrs/npc.model';
import { QuickGear, QuickGearJson, QuickGearSlots } from '../model/damage-sim/quick-gear.model';
import { CombatStats, Skill } from '../model/osrs/skill.type';
import { RuneliteGear } from '../model/damage-sim/runelite-gear.model';
import { Highscore, HighScoreSkill } from '../model/osrs/highscore.model';

@Injectable({
  providedIn: 'root',
})
export class DamageSimService {
  public allGearSlotItems$: Observable<Record<GearSlot, Item[]>>;
  public gearSetupPresets$: Observable<GearSetupPreset[]>;
  public quickGearSlots$: Observable<QuickGearSlots>;

  public dmgSimExampleSetups$: Observable<ExampleSetup[]>;
  public abbreviations$: Observable<Record<string, string[]>>;

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

    this.gearSetupPresets$ = this.getGearSetupPresets().pipe(shareReplay(1));

    //TODO enums are scuffed
    this.quickGearSlots$ = forkJoin([this.getQuickGearJson(), this.allGearSlotItems$]).pipe(
      map(([quickGearJson, allGearSlotItems]) => {
        const quickGearSlots: QuickGearSlots = {} as QuickGearSlots;
        for (const gearSlot in GearSlot) {
          const gearSlotValue = GearSlot[gearSlot as keyof typeof GearSlot] as keyof QuickGearSlots;
          quickGearSlots[gearSlotValue] = {} as QuickGear;
          allAttackTypes.forEach((attackType: AttackType) => {
            quickGearSlots[gearSlotValue][attackType] = [];
            quickGearJson[gearSlot as keyof QuickGearJson][attackType].forEach((itemId) => {
              const item: Item = allGearSlotItems[GearSlot[gearSlot as keyof typeof GearSlot] as GearSlot].find(
                (item: Item) => item.id === itemId
              );
              quickGearSlots[gearSlotValue][attackType].push(item);
            });
          });
        }
        return quickGearSlots;
      }),
      shareReplay(1)
    );

    this.dmgSimExampleSetups$ = this.getDmgSimExampleSetups().pipe(shareReplay(1));
    this.abbreviations$ = this.getAbbreviations().pipe(shareReplay(1));

    this.allSpells$ = this.getSpells().pipe(shareReplay(1));
    this.allNpcs$ = this.getNpcs().pipe(shareReplay(1));
    this.allDarts$ = this.getDarts().pipe(shareReplay(1));
  }

  public getStatus(): Observable<string> {
    return this.http.get<string>(this.damageSimServiceUrl + '/status');
  }

  public runDpsCalc(inputSetupJson: string): Observable<DpsResults> {
    const options = { headers: { 'Content-Type': 'application/json' } };
    return this.http.post<DpsResults>(this.damageSimServiceUrl + '/run-dps-calc', inputSetupJson, options);
  }

  public lookupHighscore(rsn: string): Observable<CombatStats> {
    return this.http.get<Highscore>(this.damageSimServiceUrl + '/lookup-highscore?player=' + rsn).pipe(
      map((highscore: Highscore) => highscore.skills),
      map((skills: HighScoreSkill[]) =>
        skills.reduce((combatStats: CombatStats, skills: HighScoreSkill) => {
          combatStats[skills.name.toLowerCase() as Skill] = skills.level;
          return combatStats;
        }, {} as CombatStats)
      )
    );
  }

  public getRuneliteGearSetup(): Observable<number[]> {
    return this.http.get<RuneliteGear[]>('http://localhost:8080/equip').pipe(
      map((equipment: RuneliteGear[]) => equipment ?? []),
      map((equipment: RuneliteGear[]) =>
        equipment.filter((item: RuneliteGear) => item.id !== -1).map((item: RuneliteGear) => item.id)
      )
    );
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

  private getQuickGearJson(): Observable<QuickGearJson> {
    return this.http.get<QuickGearJson>('assets/json_data/quick_gear.json');
  }

  private getDarts(): Observable<Item[]> {
    return this.allGearSlotItems$.pipe(
      map((gearSlotItem: Record<GearSlot, Item[]>) =>
        gearSlotItem[GearSlot.Weapon].filter((item: Item) => item.name.match('dart$'))
      )
    );
  }

  private getDmgSimExampleSetups(): Observable<ExampleSetup[]> {
    return this.http.get<ExampleSetup[]>('assets/json_data/dmg_sim_example_setups.json');
  }

  private getAbbreviations(): Observable<Record<string, string[]>> {
    return this.http.get<Record<string, string[]>>('assets/json_data/abbreviations.json');
  }
}
