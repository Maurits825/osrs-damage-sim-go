import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { GearSetupTabComponent } from '../gear-setup-tab/gear-setup-tab.component';
import { AttackType } from '../model/attack-type.enum';
import { GearInputSetup } from '../model/input-setup.model';
import { Item } from '../model/item.model';
import { DamageSimService } from '../services/damage-sim.service';
import { GearSetupService } from '../services/gear-setups.service';
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

  prayers: string[] = ["eagle_eye", "rigour", "chivalry", "piety"];
  selectedPrayers: string[] = [];

  attackCount: number = 0;
  isSpecialAttack: boolean = false;

  //TODO maybe refactor to enums
  skills: string[] = ["attack", "strength", "ranged", "magic"];

  combatStats: Record<string, number> = {};

  boosts: string[] = ["smelling_salts", "super_combat_pot", "ranged_pot"];
  selectedBoosts: string[] = [];

  weaponSlot = 3;

  blowpipeId = 12926;
  dragonDartId = 11230;
  selectedDart: Item;
  dartItems: Item[] = [];

  gearToCopy: GearSetupComponent;

  constructor(
    private damageSimservice: DamageSimService,
    private rlGearService: RlGearService,
    private gearSetupService: GearSetupService,
    ) {}

  ngOnInit(): void {
    forkJoin({
      gearSlotItems: this.damageSimservice.getGearSlotItems(),
      gearSetups: this.gearSetupService.getGearSetups(),
      styles: this.damageSimservice.getAttackStyles(0),
    })
    .subscribe(({gearSlotItems, gearSetups, styles}) => {
      this.allGearSlotItems = gearSlotItems;
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
      isSpecial: this.isSpecialAttack,
      prayers: this.selectedPrayers,
      combatStats: this.combatStats,
      boosts: this.selectedBoosts
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
    this.isSpecialAttack = false;
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
    this.setupName = setupName;

    this.setCurrentGear(gearSetup);
  }

  setCurrentGear(gearSetup: Record<number, Item>): void {
    this.gearSlots.forEach((slot: number) => {
      if (gearSetup[slot]?.name) {
        this.currentGear[slot] = this.allGearSlotItems[slot][gearSetup[slot].id];

        this.gearSlotChange(this.currentGear[slot], slot, false);
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
      
      //TODO maybe check if user has input value, how though?
      if (!this.setupName) {
        this.setupName = item.name;
      }

      this.damageSimservice.getAttackType(item.id).subscribe((attackType: string) => {
        if (this.selectedPrayers.length == 0) {
          switch (attackType as AttackType) {
            case AttackType.MELEE:
              this.selectedPrayers.push("piety")
              break;
            case AttackType.RANGED:
              this.selectedPrayers.push("rigour")
              break;
          
            default:
              break;
          }
        }
      });
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

    this.setCurrentGear(gearSetupComponent.currentGear)

    this.selectedAttackStyle = gearSetupComponent.selectedAttackStyle;
    this.attackCount = gearSetupComponent.attackCount;
    this.isSpecialAttack = gearSetupComponent.isSpecialAttack;
    this.selectedPrayers = [... gearSetupComponent.selectedPrayers];
    this.combatStats = {... gearSetupComponent.combatStats};
    this.selectedBoosts = [...gearSetupComponent.selectedBoosts];
  }
}
