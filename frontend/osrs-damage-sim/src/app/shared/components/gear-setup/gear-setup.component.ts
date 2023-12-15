import { Component, Inject, Input, OnDestroy, OnInit, Optional, SkipSelf, ViewChild } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { skip } from 'rxjs/operators';
import {
  DRAGON_DARTS_ID,
  UNARMED_EQUIVALENT_ID,
  DEFAULT_GEAR_SETUP,
  AUTOCAST_STLYE as AUTOCAST_STYLE,
} from './gear-setup.const';
import { Prayer } from 'src/app/model/osrs/prayer.model';
import { SpecialGearService } from 'src/app/services/special-gear.service';
import { GEAR_SETUP_TOKEN } from 'src/app/model/damage-sim/injection-token.const';
import { GearSet } from 'src/app/model/damage-sim/gear-set.model';
import { GearSetupPreset } from 'src/app/model/damage-sim/gear-preset.model';
import { Condition } from 'src/app/model/damage-sim/condition.model';
import { GearSetup } from 'src/app/model/damage-sim/input-setup.model';
import { SpecialGear } from 'src/app/model/damage-sim/special-gear.model';
import { GearSlot } from 'src/app/model/osrs/gear-slot.enum';
import { Item, AttackType, allAttackTypes } from 'src/app/model/osrs/item.model';
import { DamageSimService } from 'src/app/services/damage-sim.service';
import { ConditionComponent } from '../condition/condition.component';
import { GearSetupTabComponent } from '../gear-setup-tab/gear-setup-tab.component';
import { ItemService } from 'src/app/services/item.service';
import { Mode } from 'src/app/model/mode.enum';
import { GlobalSettingsService } from 'src/app/services/global-settings.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-gear-setup.col-md-6',
  templateUrl: './gear-setup.component.html',
  styleUrls: ['./gear-setup.component.css'],
})
export class GearSetupComponent implements OnInit, OnDestroy {
  @ViewChild(ConditionComponent) conditionComponent: ConditionComponent;

  @Input()
  mode: Mode = Mode.DamageSim;
  Mode = Mode;

  setupCount: number;
  isMainGearSetup = false;
  gearSetupTabRef: GearSetupTabComponent;

  GearSlot = GearSlot;

  allGearSlots: GearSlot[] = Object.values(GearSlot);

  allGearSlotItems: Record<GearSlot, Item[]>;

  gearSetupPresets: GearSetupPreset[];
  allGearSetupPresets: GearSetupPreset[];

  attackStyles: string[];
  allSpells: string[];

  allAttackTypes = allAttackTypes;
  currentAttackType: AttackType = 'melee';

  allDarts: Item[];

  specialGear: SpecialGear = {
    isSpecialWeapon: false,
    isSlayerHelm: false,
    isWildernessWeapon: false,
    isDharokSet: false,
    isSpecialBolt: false,
    isBlowpipe: false,
    isPickaxe: false,
  };

  Item: Item;

  private destroyed$ = new Subject();

  constructor(
    private damageSimservice: DamageSimService,
    private itemService: ItemService,
    private globalSettingsService: GlobalSettingsService,
    private specialGearService: SpecialGearService,
    private localStorageService: LocalStorageService,
    @SkipSelf() @Optional() @Inject(GEAR_SETUP_TOKEN) public gearSetup: GearSetup
  ) {}

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  ngOnInit(): void {
    forkJoin({
      allGearSlotItems: this.damageSimservice.allGearSlotItems$,
      gearSetupPresets: this.damageSimservice.gearSetupPresets$,
      allSpells: this.damageSimservice.allSpells$,
      allDarts: this.damageSimservice.allDarts$,
    }).subscribe(({ allGearSlotItems, gearSetupPresets, allSpells, allDarts }) => {
      this.allGearSlotItems = allGearSlotItems;
      this.gearSetupPresets = gearSetupPresets;
      this.allSpells = allSpells;
      this.allDarts = allDarts;

      this.localStorageService.gearSetupWatch$.subscribe(
        (userGearSetups: GearSetupPreset[]) =>
          (this.allGearSetupPresets = [...this.gearSetupPresets, ...userGearSetups])
      );

      if (this.gearSetup) {
        this.setGearSetup(this.gearSetup);
      } else {
        this.gearSetup = cloneDeep(DEFAULT_GEAR_SETUP);

        this.gearSetup.blowpipeDarts = this.allDarts.find((dart: Item) => dart.id === DRAGON_DARTS_ID);

        this.gearSetup.prayers = new Set(this.globalSettingsService.globalPrayers$.getValue()['melee']);
        this.attackStyles = this.itemService.getItem(GearSlot.Weapon, UNARMED_EQUIVALENT_ID).attackStyles;
      }

      this.globalSettingsService.globalPrayers$
        .pipe(takeUntil(this.destroyed$), skip(1))
        .subscribe(
          (prayers: Record<AttackType, Set<Prayer>>) =>
            (this.gearSetup.prayers = new Set(prayers[this.currentAttackType]))
        );
    });
  }

  getGearSetup(): GearSetup {
    return this.gearSetup;
  }

  loadGearSetupPreset(gearSetupPreset: GearSetupPreset) {
    this.setCurrentGearByIds(gearSetupPreset.gearIds, true);
    this.gearSetup.setupName = gearSetupPreset.name;
    this.gearSetup.presetName = gearSetupPreset.name;
  }

  setCurrentGearByGearSlotAndId(gearIds: Record<GearSlot, number>): void {
    this.allGearSlots.forEach((slot: GearSlot) => {
      if (gearIds[slot]) {
        const item = this.itemService.getItem(slot, gearIds[slot]);
        this.gearSlotChange(item, slot);
        this.gearSetup.gear[slot] = item;
      } else {
        this.gearSlotChange(null, slot);
        this.gearSetup.gear[slot] = null;
      }
    });
  }

  setCurrentGearByIds(gearIds: number[], clearEmtpy = false): void {
    this.allGearSlots.forEach((slot: GearSlot) => {
      if (clearEmtpy) {
        this.gearSlotChange(null, slot);
        this.gearSetup.gear[slot] = null;
      }

      gearIds.forEach((itemId: number) => {
        const item = this.itemService.getItem(slot, itemId);
        if (item) {
          this.gearSlotChange(item, slot);
          this.gearSetup.gear[slot] = item;
        }
      });
    });
  }

  gearSlotChange(item: Item, slot: GearSlot): void {
    this.gearSetup.gear[slot] = item;
    this.gearSetup.presetName = null;

    if (slot === GearSlot.Weapon) {
      const itemId = item?.id || UNARMED_EQUIVALENT_ID;
      this.gearSetup.setupName = 'Unarmed';
      this.currentAttackType = 'melee';

      if (item) {
        this.gearSetup.setupName = item.name;
        this.currentAttackType = item.attackType;
      }

      this.gearSetup.prayers = new Set(this.globalSettingsService.globalPrayers$.getValue()[this.currentAttackType]);

      this.updateAttackStyle(itemId);
    }

    this.updateSpecialGear();
  }

  updateAttackStyle(itemId: number): void {
    this.attackStyles = this.itemService.getItem(GearSlot.Weapon, itemId).attackStyles;
    if (this.attackStyles.includes(AUTOCAST_STYLE)) {
      this.gearSetup.attackStyle = AUTOCAST_STYLE;
    } else {
      this.gearSetup.attackStyle = this.attackStyles[1]; //second attack style is most commonly used
    }
  }

  togglePrayer(prayer: Prayer): void {
    this.globalSettingsService.togglePrayer(prayer, this.gearSetup.prayers);
  }

  removeGearSetup(): void {
    this.gearSetupTabRef.removeGearSetup(this.setupCount);
  }

  setGearSetup(gearSetup: GearSetup): void {
    this.gearSetup = cloneDeep(gearSetup);

    const itemId = this.gearSetup.gear[GearSlot.Weapon]?.id || UNARMED_EQUIVALENT_ID;

    const weapon = this.itemService.getItem(GearSlot.Weapon, itemId);
    this.attackStyles = weapon.attackStyles;
    this.currentAttackType = weapon.attackType;
    this.updateSpecialGear();
  }

  updateConditions(conditions: Condition[]): void {
    this.gearSetup.conditions = conditions;
  }

  duplicateGearSetup(): void {
    this.gearSetupTabRef.addNewGearSetup(this.gearSetup);
  }

  updateSpecialGear(): void {
    this.specialGear = this.specialGearService.getSpecialGear(this.gearSetup);
  }

  selectedSpellChange(): void {
    if (this.attackStyles.includes(AUTOCAST_STYLE)) {
      this.gearSetup.attackStyle = AUTOCAST_STYLE;
    } else {
      this.gearSetup.attackStyle = null;
    }
  }

  selectGearSetSetup(gearSet: GearSet): void {
    this.setCurrentGearByIds(gearSet.itemIds);
  }

  setAttackType(attackType: AttackType): void {
    this.currentAttackType = attackType;
  }

  saveGearSetup(): void {
    this.localStorageService.saveGearSetup(this.gearSetup).subscribe((error: string | null) => console.log(error));
  }

  deleteUserGearSetup(event: Event, setupName: string): void {
    event.stopPropagation();
    this.localStorageService.deleteGearSetup(setupName);
  }
}
