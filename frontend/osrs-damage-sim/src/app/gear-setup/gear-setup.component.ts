import { Component, OnInit, ViewChild } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ConditionComponent } from '../condition/condition.component';
import { POTIONS } from '../constants.const';
import { GearSetupTabComponent } from '../gear-setup-tab/gear-setup-tab.component';
import { AttackType } from '../model/attack-type.enum';
import { Condition } from '../model/condition.model';
import { GearInputSetup } from '../model/input-setup.model';
import { Item } from '../model/item.model';
import { SpecialAttack } from '../model/special-attack.model';
import { DamageSimService } from '../services/damage-sim.service';
import { GearSetupService } from '../services/gear-setups.service';
import { GlobalBoostService } from '../services/global-boost.service';
import { RlGearService } from '../services/rl-gear.service';

@Component({
  selector: 'app-gear-setup.col-md-6',
  templateUrl: './gear-setup.component.html',
  styleUrls: ['./gear-setup.component.css']
})
export class GearSetupComponent implements OnInit {
  setupCount!: number;
  gearSetUpTabRef!: GearSetupTabComponent;

  gearSlots: Array<any> = [0, 1, 2, 3, 4, 5, 7, 9, 10, 12, 13];

  currentGear: Record<number, Item> = {};

  allGearSlotItems: Record<number, Record<number, Item>> = {};

  gearSetups: Record<string, Record<number, Item>> = {};
  selectedGearSetup: string = "";

  setupName: string = "";

  attackStyles: string[] = [];
  selectedAttackStyle: string = null;

  prayers: string[] = ["eagle_eye", "rigour", "chivalry", "piety", "augury"];
  selectedPrayers: string[] = [];

  attackCount: number = 0;
  useSpecialAttack: boolean = false;
  isSpecialWeapon: boolean = false;
  specialWeapons: SpecialAttack;
  isFill: boolean = false;

  //TODO maybe refactor to enums
  skills: string[] = ["attack", "strength", "ranged", "magic"];

  combatStats: Record<string, number> = {};

  boosts: string[] = POTIONS;
  selectedBoosts: string[] = [];

  weaponSlot = 3;

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

  @ViewChild(ConditionComponent) conditionComponent: ConditionComponent;

  constructor(
    private damageSimservice: DamageSimService,
    private rlGearService: RlGearService,
    private gearSetupService: GearSetupService,
    private globalBoostService: GlobalBoostService,
    ) {}

  ngOnInit(): void {
    forkJoin({
      gearSlotItems: this.damageSimservice.getGearSlotItems(),
      gearSetups: this.gearSetupService.getGearSetups(),
      styles: this.damageSimservice.getAttackStyles(0),
      specialWeapons: this.damageSimservice.getSpecialWeapons(),
    })
    .subscribe(({gearSlotItems, gearSetups, styles, specialWeapons}) => {
      this.allGearSlotItems = gearSlotItems;
      this.specialWeapons = specialWeapons;

      for (const itemId in this.allGearSlotItems[this.weaponSlot]){
        if (this.allGearSlotItems[this.weaponSlot][itemId].name.match("dart$")) {
          this.dartItems.push(this.allGearSlotItems[this.weaponSlot][itemId]);
        }
      }
      this.selectedDart = this.allGearSlotItems[this.weaponSlot][this.dragonDartId];

      this.gearSetups = gearSetups;
      this.attackStyles = styles;
      this.skills.forEach(skill => {
        this.combatStats[skill] = 99;
      });

      if (this.gearToCopy) {
        this.setGearSetup(this.gearToCopy);
      }
      else {
        this.selectedBoosts = [... this.globalBoostService.getGlobalBoosts()];
      }

      this.globalBoostService.boostsAdded.subscribe(boost => {
        if (!this.selectedBoosts.includes(boost)) {
          this.selectedBoosts.push(boost)
        }
      });
      this.globalBoostService.boostsRemoved.subscribe(boost => this.selectedBoosts = this.selectedBoosts.filter(b => b !== boost));
    });
  }

  getGearInputSetup(): GearInputSetup {
    const gearList = [];
    for (const gearSlot in this.currentGear) {
      if (this.currentGear[gearSlot]) {
        gearList.push(this.currentGear[gearSlot].id);
      }
    }

    return {
      name: this.setupName,
      gear: gearList,
      weapon: this.currentGear[this.weaponSlot].id,
      blowpipeDarts: this.selectedDart.id,
      attackStyle: this.selectedAttackStyle,
      attackCount: this.attackCount,
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
    };
  }

  clearAllGear(): void {
    this.selectedGearSetup = null;
    this.setupName = "";
    
    this.gearSlots.forEach((slot: number) => {
      this.clearGearSlot(slot);
    });

    this.selectedPrayers = [];
    this.selectedBoosts = [];
    this.attackCount = 0;
    this.useSpecialAttack = false;
  }

  loadRlGear(): void {
    this.selectedGearSetup = null;
    
    this.rlGearService.getGear()
      .subscribe((gearSetup: Record<number, Item>) => {
        this.setCurrentGear(gearSetup);
        if (gearSetup[this.weaponSlot]?.name) {
          this.setupName = gearSetup[this.weaponSlot].name;
        }
    });
  }

  clearGearSlot(slot: number): void {
    this.currentGear[slot] = null;

    if (slot == 3) {
      this.damageSimservice.getAttackStyles(0).subscribe((styles: string[]) => {
        this.attackStyles = styles;
        this.selectedAttackStyle = null;
      });
    }
  }

  loadGearSetup(setupName: string) {
    const gearSetup = this.gearSetups[setupName];
    this.setCurrentGear(gearSetup);
    this.setupName = setupName;
  }

  setCurrentGear(gearSetup: Record<number, Item>, triggerSlotChange: boolean = true): void {
    this.gearSlots.forEach((slot: number) => {
      if (gearSetup[slot]?.name) {
        this.currentGear[slot] = this.allGearSlotItems[slot][gearSetup[slot].id];

        if (triggerSlotChange) {
          this.gearSlotChange(this.currentGear[slot], slot, false);
        }
      }
      else {
        this.clearGearSlot(slot);
      }
    });
  }

  gearSlotChange(item: Item, slot: number, clearSelectedGearSetup: boolean = true): void {
    if (clearSelectedGearSetup) {
      this.selectedGearSetup = null;
    }

    if (slot == 3) {
      if (item?.id) {
        this.updateAttackStyle(item.id);
      }
      else {
        this.updateAttackStyle(0);
      }
      
      this.setupName = item.name;

      this.damageSimservice.getAttackType(item.id).subscribe((attackType: string) => {
        switch (attackType as AttackType) {
          case AttackType.MELEE:
            this.selectedPrayers = [];
            this.selectedPrayers.push("piety")
            break;
          case AttackType.RANGED:
            this.selectedPrayers = [];
            this.selectedPrayers.push("rigour")
            break;
          case AttackType.MAGIC:
            this.selectedPrayers = [];
            this.selectedPrayers.push("augury")
            break;
        
          default:
            break;
        }
      });

      this.isSpecialWeapon = !!(this.specialWeapons[item.name]);
    }
  }

  updateAttackStyle(itemId: number): void {
    this.damageSimservice.getAttackStyles(itemId).subscribe((styles: string[]) => {
      this.attackStyles = styles;
      this.selectedAttackStyle = this.attackStyles[1]; //second attack style is most commonly used
    });
  }

  addPrayer(prayer: string): void {
    this.selectedPrayers.push(prayer);
  }

  removePrayer(prayer: string): void {
    this.selectedPrayers = this.selectedPrayers.filter(p => p !== prayer);
  }

  removeGearSetup(): void {
    this.gearSetUpTabRef.removeGearSetup(this.setupCount);
  }

  addBoost(boost: string): void {
    this.selectedBoosts.push(boost);
  }

  removeBoost(boost: string): void {
    this.selectedBoosts = this.selectedBoosts.filter(b => b !== boost);
  }

  setGearSetup(gearSetupComponent: GearSetupComponent): void {
    this.setupName = gearSetupComponent.setupName;
    this.selectedGearSetup = gearSetupComponent.selectedGearSetup;

    this.attackStyles = [... gearSetupComponent.attackStyles];
    this.selectedAttackStyle = gearSetupComponent.selectedAttackStyle;
    this.setCurrentGear(gearSetupComponent.currentGear, false);

    this.attackCount = gearSetupComponent.attackCount;
    this.useSpecialAttack = gearSetupComponent.useSpecialAttack;
    this.isFill = gearSetupComponent.isFill;
    this.isSpecialWeapon = gearSetupComponent.isSpecialWeapon;

    this.isOnSlayerTask = gearSetupComponent.isOnSlayerTask;
    this.isInWilderness = gearSetupComponent.isInWilderness;

    this.currentHp = gearSetupComponent.currentHp;
    this.maxHp = gearSetupComponent.maxHp;
    this.miningLvl = gearSetupComponent.miningLvl;

    this.selectedPrayers = [... gearSetupComponent.selectedPrayers];
    this.combatStats = {... gearSetupComponent.combatStats};
    this.selectedBoosts = [...gearSetupComponent.selectedBoosts];
    this.conditionComponent.conditions = [... gearSetupComponent.conditions];
  }

  updateConditions(conditions: Condition[]): void {
    this.conditions = conditions;
  }

  copyGearSetup(): void {
    this.gearSetUpTabRef.addNewGearSetup(this);
  }

  isSlayerHelm(itemName: string): boolean {
    if (!itemName) {
      return false;
    }

    const name = itemName.toLowerCase();
    return name.includes("slayer helmet") || name.includes("black mask");
  }

  isWildernessWeapon(itemName: string): boolean {
    return itemName === "Craw's bow" || itemName === "Thammaron's sceptre" || itemName === "Viggora's chainmace"
  }

  isDharokSet(): boolean {
    return this.currentGear[0]?.id == 4716 &&
    this.currentGear[3]?.id == 4718 && 
    this.currentGear[4]?.id == 4720 && 
    this.currentGear[7]?.id == 4722;
  }

  useSpecialAttackChange(): void {
    if (this.useSpecialAttack) {
      this.isFill = true;
    }
  }
}
