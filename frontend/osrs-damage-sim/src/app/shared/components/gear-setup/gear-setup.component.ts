import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { cloneDeep, uniqueId } from 'lodash-es';
import { forkJoin, Observable, Subject, takeUntil } from 'rxjs';
import { skip } from 'rxjs/operators';
import {
  DRAGON_DARTS_ID,
  UNARMED_EQUIVALENT_ID,
  DEFAULT_GEAR_SETUP,
  AUTOCAST_STLYE as AUTOCAST_STYLE,
  QUICK_GEAR_SETS,
} from '../../../model/shared/gear-setup.model';
import { Prayer } from 'src/app/model/osrs/prayer.model';
import { SpecialGearService } from 'src/app/services/special-gear.service';
import { GearSet } from 'src/app/model/shared/gear-set.model';
import { GearSetupPreset } from 'src/app/model/shared/gear-preset.model';
import { SpecialGear } from 'src/app/model/shared/special-gear.model';
import { GearSlot } from 'src/app/model/osrs/gear-slot.enum';
import { Item, AttackType, allAttackTypes } from 'src/app/model/osrs/item.model';
import { DamageSimService } from 'src/app/services/damage-sim.service';
import { ItemService } from 'src/app/services/item.service';
import { SharedSettingsService } from 'src/app/services/shared-settings.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap/popover/popover';
import { UserSettings } from 'src/app/model/shared/user-settings.model';
import { StaticDataService } from 'src/app/services/static-data.service';
import { GearSetup } from 'src/app/model/shared/gear-setup.model';

@Component({
  selector: 'app-gear-setup',
  templateUrl: './gear-setup.component.html',
})
export class GearSetupComponent implements OnInit, OnDestroy {
  @Input()
  gearSetup: GearSetup;

  @Output()
  gearSetupChange = new EventEmitter<GearSetup>();

  setupId = uniqueId();

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

  isLoadingFromRl = false;

  userSettingsWatch$: Observable<UserSettings>;

  quickGearSetLabel: string = null;
  quickGearSet: number[];

  private destroyed$ = new Subject();

  constructor(
    private damageSimservice: DamageSimService,
    private staticDataService: StaticDataService,
    private itemService: ItemService,
    private sharedSettingsService: SharedSettingsService,
    private specialGearService: SpecialGearService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  ngOnInit(): void {
    forkJoin({
      allGearSlotItems: this.staticDataService.allGearSlotItems$,
      gearSetupPresets: this.staticDataService.gearSetupPresets$,
      allSpells: this.staticDataService.allSpells$,
      allDarts: this.staticDataService.allDarts$,
    }).subscribe(({ allGearSlotItems, gearSetupPresets, allSpells, allDarts }) => {
      this.allGearSlotItems = allGearSlotItems;
      this.gearSetupPresets = gearSetupPresets;
      this.allSpells = allSpells;
      this.allDarts = allDarts;

      this.localStorageService.gearSetupWatch$.subscribe(
        (userGearSetups: GearSetupPreset[]) =>
          (this.allGearSetupPresets = [...this.gearSetupPresets, ...userGearSetups])
      );

      this.userSettingsWatch$ = this.localStorageService.userSettingsWatch$;

      //TODO improve this a bit?
      if (this.gearSetup) {
        const itemId = this.gearSetup.gear[GearSlot.Weapon]?.id || UNARMED_EQUIVALENT_ID;
        const weapon = this.itemService.getItem(GearSlot.Weapon, itemId);
        this.currentAttackType = weapon.attackType;
      } else {
        this.gearSetup = cloneDeep(DEFAULT_GEAR_SETUP);

        this.gearSetup.blowpipeDarts = this.allDarts.find((dart: Item) => dart.id === DRAGON_DARTS_ID);
        this.gearSetup.prayers = new Set(this.sharedSettingsService.prayers$.getValue()['melee']);
        this.attackStyles = this.itemService.getItem(GearSlot.Weapon, UNARMED_EQUIVALENT_ID).attackStyles;

        this.gearSetupChange.emit(this.gearSetup);
      }

      this.sharedSettingsService.prayers$
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
    this.gearSetup.spell = null;

    this.setCurrentGearByIds(gearSetupPreset.gearIds, true);
    this.gearSetup.setupName = gearSetupPreset.name;
    this.gearSetup.presetName = gearSetupPreset.name;

    if (gearSetupPreset.attackStyle) {
      this.gearSetup.attackStyle = gearSetupPreset.attackStyle;
    }
    if (gearSetupPreset.spell) {
      this.gearSetup.spell = gearSetupPreset.spell;
      this.selectedSpellChange();
    }
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

      this.gearSetup.prayers = new Set(this.sharedSettingsService.prayers$.getValue()[this.currentAttackType]);

      this.updateAttackStyle(itemId);
    }

    this.updateSpecialGear();
    this.updateQuickEquipSet();
    this.gearSetupChange.emit(this.gearSetup);
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
    this.sharedSettingsService.togglePrayer(prayer, this.gearSetup.prayers);
    this.gearSetupChange.emit(this.gearSetup);
  }

  updateSpecialGear(): void {
    this.specialGear = this.specialGearService.getSpecialGear(this.gearSetup);
    if (!this.specialGear.isSpecialWeapon) {
      this.gearSetup.isSpecial = false;
    }
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

  saveGearSetup(popover: NgbPopover): void {
    this.localStorageService.saveGearSetup(this.gearSetup).subscribe((error: string | null) => {
      popover.open({ error });
    });
  }

  deleteUserGearSetup(event: Event, setupName: string): void {
    event.stopPropagation();
    this.localStorageService.deleteGearSetup(setupName);
  }

  loadGearSetupFromRunelite(popover: NgbPopover): void {
    this.isLoadingFromRl = true;

    this.damageSimservice.getRuneliteGearSetup().subscribe({
      next: (gearIds: number[]) => {
        this.isLoadingFromRl = false;
        this.setCurrentGearByIds(gearIds, true);
        popover.open({ error: undefined });
      },
      error: () => {
        this.isLoadingFromRl = false;
        popover.open({ error: 'Error loading' });
      },
    });
  }

  updateQuickEquipSet(): void {
    for (const gearSlot of this.allGearSlots) {
      const gearItem = this.gearSetup.gear[gearSlot];
      if (!gearItem) continue;
      for (const gearSet of QUICK_GEAR_SETS) {
        if (gearSet.itemIds.includes(gearItem.id)) {
          this.quickGearSetLabel = gearSet.label;
          this.quickGearSet = gearSet.itemIds;
          return;
        }
      }
    }

    this.quickGearSetLabel = null;
    this.quickGearSet = null;
  }

  equipQuickGearSet(): void {
    this.setCurrentGearByIds(this.quickGearSet);
  }
}
