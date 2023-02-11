import { Component, OnDestroy, OnInit, Optional, SkipSelf, ViewChild } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { forkJoin, Subscription } from 'rxjs';
import { skip } from 'rxjs/operators';
import { ConditionComponent } from '../condition/condition.component';
import { AUTOCAST_STLYE } from '../../constants.const';
import { GearSetupTabComponent } from '../gear-setup-tab/gear-setup-tab.component';
import { allBoosts, Boost } from '../../model/osrs/boost.model';
import { Condition } from '../../model/damage-sim/condition.model';
import { GearSlot } from '../../model/osrs/gear-slot.enum';
import { GearInputSetup } from '../../model/damage-sim/input-setup.model';
import { AttackType, Item } from '../../model/osrs/item.model';
import { CombatStats } from '../../model/osrs/skill.type';
import { SpecialGear } from '../../model/damage-sim/special-gear.model';
import { DamageSimService } from '../../services/damage-sim.service';
import { BoostService } from '../../services/boost.service';
import { RlGearService } from '../../services/rl-gear.service';
import { DRAGON_DARTS_ID, SPECIAL_BOLTS, UNARMED_EQUIVALENT_ID, DEFAULT_GEAR_SETUP } from './gear-setup.const';
import { Prayer } from 'src/app/model/osrs/prayer.model';
import { PrayerService } from 'src/app/services/prayer.service';
import { CombatStatService } from 'src/app/services/combat-stat.service';

@Component({
  selector: 'app-gear-setup.col-md-6',
  templateUrl: './gear-setup.component.html',
  styleUrls: ['./gear-setup.component.css'],
})
export class GearSetupComponent implements OnInit, OnDestroy {
  @ViewChild(ConditionComponent) conditionComponent: ConditionComponent;

  setupCount: number;
  gearSetupTabRef: GearSetupTabComponent;

  GearSlot = GearSlot;

  gearInputSetup: GearInputSetup;

  allGearSlots: GearSlot[] = Object.values(GearSlot);

  allGearSlotItems: Record<GearSlot, Item[]>;

  gearSetupPresets: Record<string, Record<GearSlot, number>> = {};
  selectedGearSetupPreset: string = '';

  allBoosts = allBoosts;

  attackStyles: string[];
  allSpells: string[];

  allDarts: Item[];

  private subscriptions: Subscription = new Subscription();

  specialGear: SpecialGear = {
    isSpecialWeapon: false,
    isSlayerHelm: false,
    isWildernessWeapon: false,
    isDharokSet: false,
    isSpecialBolt: false,
  };

  constructor(
    private damageSimservice: DamageSimService,
    private rlGearService: RlGearService,
    private boostService: BoostService,
    private prayerService: PrayerService,
    private combatStatService: CombatStatService,
    @SkipSelf() @Optional() private gearSetupToCopy: GearSetupComponent
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
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

      if (this.gearSetupToCopy) {
        this.setGearSetup(this.gearSetupToCopy);
      } else {
        this.gearInputSetup = cloneDeep(DEFAULT_GEAR_SETUP);

        this.gearInputSetup.blowpipeDarts = this.allDarts.find((dart: Item) => dart.id === DRAGON_DARTS_ID);

        this.gearInputSetup.boosts = new Set(this.boostService.globalBoosts$.getValue());
        this.gearInputSetup.prayers = new Set(this.prayerService.globalPrayers$.getValue()['melee']);
        this.attackStyles = this.getItem(GearSlot.Weapon, UNARMED_EQUIVALENT_ID).attackStyles;
      }

      this.subscriptions.add(
        this.boostService.globalBoosts$
          .pipe(skip(1))
          .subscribe((boosts: Set<Boost>) => (this.gearInputSetup.boosts = new Set(boosts)))
      );

      this.subscriptions.add(
        this.prayerService.globalPrayers$
          .pipe(skip(1))
          .subscribe(
            (prayers: Record<AttackType, Set<Prayer>>) =>
              (this.gearInputSetup.prayers = new Set(
                prayers[this.gearInputSetup.gear[GearSlot.Weapon]?.attackType || 'melee']
              ))
          )
      );

      this.subscriptions.add(
        this.combatStatService.globalCombatStats$
          .pipe(skip(1))
          .subscribe((combatStats: CombatStats) => (this.gearInputSetup.combatStats = { ...combatStats }))
      );
    });
  }

  getItem(slot: GearSlot, id: number): Item {
    return this.allGearSlotItems[slot].find((item: Item) => item.id === id);
  }

  getGearInputSetup(): GearInputSetup {
    return this.gearInputSetup;
  }

  //TODO fix
  loadRlGear(): void {
    // this.selectedGearSetup = null;
    // this.rlGearService.getGear().subscribe((gearSetup: Record<number, Item>) => {
    //   this.set__CurrentGear(gearSetup);
    //   if (gearSetup[this.weaponSlot]?.name) {
    //     this.setupName = gearSetup[this.weaponSlot].name;
    //   }
    // });
  }

  loadGearSetup(setupName: string) {
    const gearIds = this.gearSetupPresets[setupName];
    this.setCurrentGearById(gearIds);
    this.gearInputSetup.setupName = setupName;
    this.selectedGearSetupPreset = setupName;
  }

  setCurrentGearById(gearIds: Record<GearSlot, number>): void {
    this.allGearSlots.forEach((slot: GearSlot) => {
      if (gearIds[slot]) {
        const item = this.getItem(slot, gearIds[slot]);
        this.gearSlotChange(item, slot);
        this.gearInputSetup.gear[slot] = item;
      } else {
        this.gearSlotChange(null, slot);
        this.gearInputSetup.gear[slot] = null;
      }
    });
  }

  gearSlotChange(item: Item, slot: GearSlot): void {
    this.selectedGearSetupPreset = null;

    if (slot === GearSlot.Weapon) {
      let itemId = UNARMED_EQUIVALENT_ID;
      this.gearInputSetup.setupName = 'Unarmed';
      let attackType: AttackType = 'melee';
      if (item) {
        itemId = item.id;
        this.gearInputSetup.setupName = item.name;
        attackType = item.attackType;
      }

      this.specialGear.isSpecialWeapon = !!item?.specialAttackCost;
      this.gearInputSetup.prayers = new Set(this.prayerService.globalPrayers$.getValue()[attackType]);

      this.updateAttackStyle(itemId);
    }

    this.updateSpecialGear();
  }

  updateAttackStyle(itemId: number): void {
    this.attackStyles = this.getItem(GearSlot.Weapon, itemId).attackStyles;
    if (this.attackStyles.includes(AUTOCAST_STLYE)) {
      this.gearInputSetup.attackStyle = AUTOCAST_STLYE;
    } else {
      this.gearInputSetup.attackStyle = this.attackStyles[1]; //second attack style is most commonly used
    }
  }

  togglePrayer(prayer: Prayer): void {
    this.prayerService.togglePrayer(prayer, this.gearInputSetup.prayers);
  }

  toggleBoost(boost: Boost): void {
    this.boostService.toggleBoost(boost, this.gearInputSetup.boosts);
  }

  combatStatsChanged(combatStats: CombatStats): void {
    this.gearInputSetup.combatStats = { ...combatStats };
  }

  removeGearSetup(): void {
    this.gearSetupTabRef.removeGearSetup(this.setupCount);
  }

  setGearSetup(gearSetupComponent: GearSetupComponent): void {
    this.gearInputSetup = cloneDeep(gearSetupComponent.gearInputSetup);

    this.selectedGearSetupPreset = gearSetupComponent.selectedGearSetupPreset;
    this.attackStyles = [...gearSetupComponent.attackStyles];
    this.specialGear = { ...gearSetupComponent.specialGear };
  }

  updateConditions(conditions: Condition[]): void {
    this.gearInputSetup.conditions = conditions;
  }

  duplicateGearSetup(): void {
    this.gearSetupTabRef.addNewGearSetup(this);
  }

  updateSpecialGear(): void {
    this.specialGear.isSlayerHelm = this.getIsSlayerHelm();
    this.specialGear.isWildernessWeapon = this.getIsWildernessWeapon();
    this.specialGear.isSpecialBolt = this.getIsSpecialBolt();
    this.specialGear.isDharokSet = this.getIsDharokSet();
  }

  getIsSlayerHelm(): boolean {
    const itemName = this.gearInputSetup.gear[GearSlot.Head]?.name;
    if (!itemName) {
      return false;
    }

    const name = itemName.toLowerCase();
    return name.includes('slayer helmet') || name.includes('black mask');
  }

  getIsWildernessWeapon(): boolean {
    const itemName = this.gearInputSetup.gear[GearSlot.Weapon]?.name;
    if (!itemName) {
      return false;
    }
    return itemName === "Craw's bow" || itemName === "Thammaron's sceptre" || itemName === "Viggora's chainmace";
  }

  getIsDharokSet(): boolean {
    return (
      this.gearInputSetup.gear[GearSlot.Head]?.id === 4716 &&
      this.gearInputSetup.gear[GearSlot.Weapon]?.id === 4718 &&
      this.gearInputSetup.gear[GearSlot.Body]?.id === 4720 &&
      this.gearInputSetup.gear[GearSlot.Legs]?.id === 4722
    );
  }

  getIsSpecialBolt(): boolean {
    return SPECIAL_BOLTS.some((boltId: number) => this.gearInputSetup.gear[GearSlot.Ammo]?.id === boltId);
  }

  useSpecialAttackChange(): void {
    if (this.gearInputSetup.isSpecial) {
      this.gearInputSetup.isFill = true;
    }
  }

  selectedSpellChange(): void {
    if (this.attackStyles.includes(AUTOCAST_STLYE)) {
      this.gearInputSetup.attackStyle = AUTOCAST_STLYE;
    } else {
      this.gearInputSetup.attackStyle = null;
    }
  }
}
