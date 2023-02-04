import { Component, OnInit, ViewChild } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { forkJoin } from 'rxjs';
import { ConditionComponent } from '../condition/condition.component';
import { AUTOCAST_STLYE } from '../constants.const';
import { GearSetupTabComponent } from '../gear-setup-tab/gear-setup-tab.component';
import { allBoosts, Boost } from '../model/boost.type';
import { Condition } from '../model/condition.model';
import { GearSlot } from '../model/gear-slot.enum';
import { GearInputSetup } from '../model/input-setup.model';
import { Item } from '../model/item.model';
import { Prayer } from '../model/prayer.enum';
import { allSkills, Skill } from '../model/skill.type';
import { SpecialGear } from '../model/special-gear.model';
import { DamageSimService } from '../services/damage-sim.service';
import { GlobalBoostService } from '../services/global-boost.service';
import { RlGearService } from '../services/rl-gear.service';
import {
  BLOWPIPE_ID,
  DEFAULT_GEAR_SETUP,
  DRAGON_DARTS_ID,
  SPECIAL_BOLTS,
  UNARMED_EQUIVALENT_ID,
} from './gear-setup.const';

@Component({
  selector: 'app-gear-setup.col-md-6',
  templateUrl: './gear-setup.component.html',
  styleUrls: ['./gear-setup.component.css'],
})
export class GearSetupComponent implements OnInit {
  @ViewChild(ConditionComponent) conditionComponent: ConditionComponent;

  setupCount: number;
  gearSetUpTabRef: GearSetupTabComponent;

  gearToCopy: GearSetupComponent;

  GearSlot = GearSlot;

  BLOWPIPE_ID = BLOWPIPE_ID;

  gearInputSetup: GearInputSetup = DEFAULT_GEAR_SETUP;

  allGearSlots: GearSlot[] = Object.values(GearSlot);

  allGearSlotItems: Record<GearSlot, Item[]>;

  gearSetupPresets: Record<string, Record<GearSlot, number>> = {};
  selectedGearSetupPreset: string = '';

  allPrayers: Prayer[] = Object.values(Prayer);
  allBoosts = allBoosts;
  skills: Skill[] = allSkills.filter((skill) => skill !== 'hitpoints');

  attackStyles: string[] = [];
  allSpells: string[] = [];

  selectedDart: Item;
  dartItems: Item[] = [];

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
    private globalBoostService: GlobalBoostService
  ) {}

  ngOnInit(): void {
    //TODO make these call in a service, then only one call per session, rather than per component
    forkJoin({
      gearSlotItems: this.damageSimservice.getGearSlotItems(),
      gearSetups: this.damageSimservice.getGearSetups(),
      allSpells: this.damageSimservice.getAllSpells(),
    }).subscribe(({ gearSlotItems, gearSetups, allSpells }) => {
      this.allGearSlotItems = gearSlotItems;
      this.allGearSlotItems[GearSlot.Weapon].forEach((item: Item) => {
        if (item.name.match('dart$')) {
          this.dartItems.push(item);
        }
      });
      this.selectedDart = this.getItem(GearSlot.Weapon, DRAGON_DARTS_ID);

      this.gearSetupPresets = gearSetups;
      this.attackStyles = this.getItem(GearSlot.Weapon, UNARMED_EQUIVALENT_ID).attackStyles;
      this.allSpells = allSpells;

      if (this.gearToCopy) {
        this.setGearSetup(this.gearToCopy);
      } else {
        this.gearInputSetup.boosts = new Set(this.globalBoostService.getBoosts());
      }

      this.globalBoostService.boostsAdded.subscribe((boost: Boost) => this.addBoost(boost));
      this.globalBoostService.boostsRemoved.subscribe((boost: Boost) => this.removeBoost(boost));
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
      let attackType = 'melee';
      if (item) {
        itemId = item.id;
        this.gearInputSetup.setupName = item.name;
        attackType = item.attackType;
      }

      this.specialGear.isSpecialWeapon = !!item?.specialAttackCost;

      switch (attackType) {
        case 'melee':
          this.gearInputSetup.spell = null;
          this.gearInputSetup.prayers = [];
          this.gearInputSetup.prayers.push('piety');
          break;
        case 'ranged':
          this.gearInputSetup.spell = null;
          this.gearInputSetup.prayers = [];
          this.gearInputSetup.prayers.push('rigour');
          break;
        case 'magic':
          this.gearInputSetup.prayers = [];
          this.gearInputSetup.prayers.push('augury');
          break;

        default:
          break;
      }

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

  addPrayer(prayer: string): void {
    this.gearInputSetup.prayers.push(prayer);
  }

  removePrayer(prayer: string): void {
    this.gearInputSetup.prayers = this.gearInputSetup.prayers.filter((p) => p !== prayer);
  }

  removeGearSetup(): void {
    this.gearSetUpTabRef.removeGearSetup(this.setupCount);
  }

  addBoost(boost: Boost): void {
    this.gearInputSetup.boosts.add(boost);
  }

  removeBoost(boost: Boost): void {
    this.gearInputSetup.boosts.delete(boost);
  }

  setGearSetup(gearSetupComponent: GearSetupComponent): void {
    this.gearInputSetup = cloneDeep(gearSetupComponent.gearInputSetup);

    this.selectedGearSetupPreset = gearSetupComponent.selectedGearSetupPreset;
    this.attackStyles = [...gearSetupComponent.attackStyles];

    this.specialGear = { ...gearSetupComponent.specialGear };

    this.conditionComponent.conditions = this.gearInputSetup.conditions;
  }

  updateConditions(conditions: Condition[]): void {
    this.gearInputSetup.conditions = conditions;
  }

  copyGearSetup(): void {
    this.gearSetUpTabRef.addNewGearSetup(this);
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
    return SPECIAL_BOLTS.some((boltId: number) => {
      this.gearInputSetup.gear[GearSlot.Ammo]?.id === boltId;
    });
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
