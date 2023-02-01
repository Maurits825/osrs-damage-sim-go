import { Component, OnInit, ViewChild } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ConditionComponent } from '../condition/condition.component';
import { AUTOCAST_STLYE, POTIONS } from '../constants.const';
import { GearSetupTabComponent } from '../gear-setup-tab/gear-setup-tab.component';
import { Condition } from '../model/condition.model';
import { GearInputSetup } from '../model/input-setup.model';
import { AttackType, Item } from '../model/item.model';
import { SpecialAttack } from '../model/special-attack.model';
import { DamageSimService } from '../services/damage-sim.service';
import { GlobalBoostService } from '../services/global-boost.service';
import { RlGearService } from '../services/rl-gear.service';

@Component({
  selector: 'app-gear-setup.col-md-6',
  templateUrl: './gear-setup.component.html',
  styleUrls: ['./gear-setup.component.css'],
})
export class GearSetupComponent implements OnInit {
  setupCount: number;
  gearSetUpTabRef: GearSetupTabComponent;

  gearSlots: Array<any> = [0, 1, 2, 3, 4, 5, 7, 9, 10, 12, 13];

  currentGear: Record<number, Item> = {};

  allGearSlotItems: Record<number, Item[]> = {};

  gearSetups: Record<string, Record<number, number>> = {};
  selectedGearSetup: string = '';

  setupName: string = '';

  attackStyles: string[] = [];
  selectedAttackStyle: string = null;
  allSpells: string[] = [];
  selectedSpell: string = null;

  prayers: string[] = ['eagle_eye', 'rigour', 'chivalry', 'piety', 'augury'];
  selectedPrayers: string[] = [];

  attackCount: number = 0;
  useSpecialAttack: boolean = false;
  isSpecialWeapon: boolean = false;
  isFill: boolean = false;

  //TODO maybe refactor to enums
  skills: string[] = ['attack', 'strength', 'ranged', 'magic'];

  combatStats: Record<string, number> = {};

  boosts: string[] = POTIONS;
  selectedBoosts: string[] = [];

  weaponSlot = 3; // TODO refactor to type

  blowpipeId = 12926;
  dragonDartId = 11230;
  selectedDart: Item;
  dartItems: Item[] = [];

  isOnSlayerTask: boolean = true;
  isInWilderness: boolean = true;

  gearToCopy: GearSetupComponent;
  conditions: Condition[] = [];

  maxHp: number = 99;
  currentHp: number = 1;

  miningLvl: number = 99;
  isKandarinDiary: boolean = true;

  isSlayerHelm: boolean;
  isWildernessWeapon: boolean;
  isDharokSet: boolean;
  isSpecialBolt: boolean;

  unarmedEquivalentId = 3689;

  @ViewChild(ConditionComponent) conditionComponent: ConditionComponent;

  constructor(
    private damageSimservice: DamageSimService,
    private rlGearService: RlGearService,
    private globalBoostService: GlobalBoostService
  ) {}

  ngOnInit(): void {
    forkJoin({
      gearSlotItems: this.damageSimservice.getGearSlotItems(),
      gearSetups: this.damageSimservice.getGearSetups(),
      allSpells: this.damageSimservice.getAllSpells(),
    }).subscribe(({ gearSlotItems, gearSetups, allSpells }) => {
      this.allGearSlotItems = gearSlotItems;

      this.allGearSlotItems[this.weaponSlot].forEach((item: Item) => {
        if (item.name.match('dart$')) {
          this.dartItems.push(item);
        }
      });
      this.selectedDart = this.getItem(this.weaponSlot, this.dragonDartId);

      this.gearSetups = gearSetups;
      this.attackStyles = this.getItem(this.weaponSlot, this.unarmedEquivalentId).attackStyles;
      this.allSpells = allSpells;

      this.skills.forEach((skill) => {
        this.combatStats[skill] = 99;
      });

      if (this.gearToCopy) {
        this.setGearSetup(this.gearToCopy);
      } else {
        this.selectedBoosts = [...this.globalBoostService.getGlobalBoosts()];
      }

      this.globalBoostService.boostsAdded.subscribe((boost) => {
        if (!this.selectedBoosts.includes(boost)) {
          this.selectedBoosts.push(boost);
        }
      });
      this.globalBoostService.boostsRemoved.subscribe(
        (boost) => (this.selectedBoosts = this.selectedBoosts.filter((b) => b !== boost))
      );
    });
  }

  getItem(slot: number, id: number): Item {
    return this.allGearSlotItems[slot].find((item: Item) => item.id === id);
  }

  getGearInputSetup(): GearInputSetup {
    const gearList = [];
    for (const gearSlot in this.currentGear) {
      if (this.currentGear[gearSlot]) {
        gearList.push(this.currentGear[gearSlot].id);
      }
    }

    const weaponId = this.currentGear[this.weaponSlot] ? this.currentGear[this.weaponSlot].id : 3689; // lyre id, same att speed as unarmed

    return {
      name: this.setupName,
      gear: gearList,
      weapon: weaponId,
      blowpipeDarts: this.selectedDart.id,
      attackStyle: this.selectedAttackStyle,
      spell: this.selectedSpell,
      isSpecial: this.useSpecialAttack,
      prayers: this.selectedPrayers,
      combatStats: this.combatStats,
      boosts: this.selectedBoosts,
      isFill: this.isFill,
      conditions: this.conditions,
      isOnSlayerTask: this.isOnSlayerTask,
      isInWilderness: this.isInWilderness,
      maxHp: this.maxHp,
      currentHp: this.currentHp,
      miningLvl: this.miningLvl,
      isKandarinDiary: this.isKandarinDiary,
    };
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
    const gearIds = this.gearSetups[setupName];
    this.setCurrentGearById(gearIds);
    this.setupName = setupName;
    this.selectedGearSetup = setupName;
  }

  setCurrentGearById(gearIds: Record<number, number>): void {
    this.gearSlots.forEach((slot: number) => {
      if (gearIds[slot]) {
        this.gearSlotChange(this.getItem(slot, gearIds[slot]), slot);
      } else {
        this.gearSlotChange(null, slot);
      }
    });
  }

  gearSlotChange(item: Item, slot: number): void {
    this.currentGear[slot] = item;

    this.selectedGearSetup = null;

    if (slot == 3) {
      let itemId = this.unarmedEquivalentId;
      this.setupName = 'Unarmed';
      let attackType = 'melee';
      if (item) {
        itemId = item.id;
        this.setupName = item.name;
        attackType = item.attackType;
      }

      this.isSpecialWeapon = !!item?.specialAttackCost;

      switch (attackType) {
        case 'melee':
          this.selectedSpell = null;
          this.selectedPrayers = [];
          this.selectedPrayers.push('piety');
          break;
        case 'ranged':
          this.selectedSpell = null;
          this.selectedPrayers = [];
          this.selectedPrayers.push('rigour');
          break;
        case 'magic':
          this.selectedPrayers = [];
          this.selectedPrayers.push('augury');
          break;

        default:
          break;
      }

      this.updateAttackStyle(itemId);
    }

    this.updateSpecialGear();
  }

  updateAttackStyle(itemId: number): void {
    this.attackStyles = this.getItem(this.weaponSlot, itemId).attackStyles;
    if (this.attackStyles.includes(AUTOCAST_STLYE)) {
      this.selectedAttackStyle = AUTOCAST_STLYE;
    } else {
      this.selectedAttackStyle = this.attackStyles[1]; //second attack style is most commonly used
    }
  }

  addPrayer(prayer: string): void {
    this.selectedPrayers.push(prayer);
  }

  removePrayer(prayer: string): void {
    this.selectedPrayers = this.selectedPrayers.filter((p) => p !== prayer);
  }

  removeGearSetup(): void {
    this.gearSetUpTabRef.removeGearSetup(this.setupCount);
  }

  addBoost(boost: string): void {
    this.selectedBoosts.push(boost);
  }

  removeBoost(boost: string): void {
    this.selectedBoosts = this.selectedBoosts.filter((b) => b !== boost);
  }

  setGearSetup(gearSetupComponent: GearSetupComponent): void {
    this.setupName = gearSetupComponent.setupName;
    this.selectedGearSetup = gearSetupComponent.selectedGearSetup;

    this.attackStyles = [...gearSetupComponent.attackStyles];
    this.selectedAttackStyle = gearSetupComponent.selectedAttackStyle;

    this.allSpells = [...gearSetupComponent.allSpells];
    this.selectedSpell = gearSetupComponent.selectedSpell;

    this.currentGear = Object.assign({}, gearSetupComponent.currentGear);

    this.attackCount = gearSetupComponent.attackCount;
    this.useSpecialAttack = gearSetupComponent.useSpecialAttack;
    this.isFill = gearSetupComponent.isFill;
    this.isSpecialWeapon = gearSetupComponent.isSpecialWeapon;

    this.isOnSlayerTask = gearSetupComponent.isOnSlayerTask;
    this.isInWilderness = gearSetupComponent.isInWilderness;

    this.currentHp = gearSetupComponent.currentHp;
    this.maxHp = gearSetupComponent.maxHp;
    this.miningLvl = gearSetupComponent.miningLvl;

    this.isKandarinDiary = gearSetupComponent.isKandarinDiary;

    this.isSlayerHelm = gearSetupComponent.isSlayerHelm;
    this.isWildernessWeapon = gearSetupComponent.isWildernessWeapon;
    this.isDharokSet = gearSetupComponent.isDharokSet;
    this.isSpecialBolt = gearSetupComponent.isSpecialBolt;

    this.selectedPrayers = [...gearSetupComponent.selectedPrayers];
    this.combatStats = { ...gearSetupComponent.combatStats };
    this.selectedBoosts = [...gearSetupComponent.selectedBoosts];
    this.conditionComponent.conditions = gearSetupComponent.conditions.map((condition) => Object.assign({}, condition));
  }

  updateConditions(conditions: Condition[]): void {
    this.conditions = conditions;
  }

  copyGearSetup(): void {
    this.gearSetUpTabRef.addNewGearSetup(this);
  }

  updateSpecialGear(): void {
    this.isSlayerHelm = this.getIsSlayerHelm();
    this.isWildernessWeapon = this.getIsWildernessWeapon();
    this.isSpecialBolt = this.getIsSpecialBolt();
    this.isDharokSet = this.getIsDharokSet();
  }

  getIsSlayerHelm(): boolean {
    const itemName = this.currentGear[0]?.name;
    if (!itemName) {
      return false;
    }

    const name = itemName.toLowerCase();
    return name.includes('slayer helmet') || name.includes('black mask');
  }

  getIsWildernessWeapon(): boolean {
    const itemName = this.currentGear[3]?.name;
    if (!itemName) {
      return false;
    }
    return itemName === "Craw's bow" || itemName === "Thammaron's sceptre" || itemName === "Viggora's chainmace";
  }

  getIsDharokSet(): boolean {
    return (
      this.currentGear[0]?.id == 4716 &&
      this.currentGear[3]?.id == 4718 &&
      this.currentGear[4]?.id == 4720 &&
      this.currentGear[7]?.id == 4722
    );
  }

  getIsSpecialBolt(): boolean {
    const specBolts = [9242, 21944, 9243, 21946];

    for (let bolt of specBolts) {
      if (this.currentGear[13]?.id == bolt) {
        return true;
      }
    }
    return false;
  }

  useSpecialAttackChange(): void {
    if (this.useSpecialAttack) {
      this.isFill = true;
    }
  }

  selectedSpellChange(): void {
    if (this.attackStyles.includes(AUTOCAST_STLYE)) {
      this.selectedAttackStyle = AUTOCAST_STLYE;
    } else {
      this.selectedAttackStyle = null;
    }
  }
}
