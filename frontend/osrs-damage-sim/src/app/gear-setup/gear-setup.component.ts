import { Component, OnInit } from '@angular/core';
import { GearSetup, GearSlotItem, GearSlotItems } from '../model/gear_slot_items';
import { Item } from '../model/item';
import { DamageSimService } from '../services/damage-sim.service';
import { GearSetupService } from '../services/gear-setups.service';
import { RlGearService } from '../services/rl-gear.service';

@Component({
  selector: 'app-gear-setup',
  templateUrl: './gear-setup.component.html',
  styleUrls: ['./gear-setup.component.css']
})
export class GearSetupComponent implements OnInit {
  gearSlots: Array<any> = [0, 1, 2, 3, 4, 5, 7, 9, 10, 12, 13];

  gear: GearSlotItem = {};

  gearSlotItems: GearSlotItems = {};

  gearSetups: GearSetup = {};
  selectedGearSetup: GearSlotItem = {};

  setupName: string = "";

  attackStyles: string[] = [];
  selectedAttackStyle: string = "";

  prayers: string[] = ["eagle_eye", "rigour", "chivalry", "piety"];
  selectedPrayers: string[] = [];

  attackCount: number = 0;
  isSpecialAttack: boolean = false;

  constructor(
    private damageSimservice: DamageSimService,
    private rlGearService: RlGearService,
    private gearSetupService: GearSetupService,
    ) {}

  ngOnInit(): void {
    this.damageSimservice.getGearSlotItems().subscribe((gearSlotItems) => {
      this.gearSlotItems = gearSlotItems;

      this.gearSlots.forEach((slot: number) => {
        const empty_item = {name: "None", id: 0}
        this.gearSlotItems[slot].push(empty_item)
        this.gear[slot] = empty_item;
      });
    });

    this.gearSetupService.getGearSetups().subscribe((gearSetups: GearSetup) => {
      this.gearSetups = gearSetups;
      this.gearSetups["None"] = {};
      this.selectedGearSetup = this.gearSetups["None"];
    });

    this.damageSimservice.getAttackStyles(0).subscribe((styles: string[]) => {
      this.attackStyles = styles;
    });
  }

  clearAllGear(): void {
    this.selectedGearSetup = this.gearSetups["None"];
    this.setupName = "";
    
    this.gearSlots.forEach((slot: number) => {
      this.clearGearSlot(slot);
    });

    this.selectedPrayers = [];
    this.attackCount = 0;
    this.isSpecialAttack = false;
  }

  loadRlGear(): void {
    this.selectedGearSetup = this.gearSetups["None"];

    this.rlGearService.getGear()
      .subscribe((gearSlotItem: GearSlotItem) => {
        this.gearSlots.forEach((slot: number) => {
          if (gearSlotItem[slot]?.name) {
            this.gear[slot].name = gearSlotItem[slot].name;
            this.gear[slot].id = gearSlotItem[slot].id;

            if (slot == 3) {
              this.setupName = gearSlotItem[slot].name;
              this.updateAttackStyle(gearSlotItem[slot].id);
            }
          }
          else {
            this.clearGearSlot(slot);
          }
        });
    });
  }

  clearGearSlot(slot: number): void {
    this.gear[slot] = {name: "None", id: 0};

    if (slot == 3) {
      this.damageSimservice.getAttackStyles(0).subscribe((styles: string[]) => {
        this.attackStyles = styles;
        this.selectedAttackStyle = "";
      });
    }
  }

  loadGearSetup(setupName: string) {
    const gearSetup = this.gearSetups[setupName];
    this.setupName = setupName;

    this.gearSlots.forEach((slot: number) => {
      if (gearSetup[slot]?.name) {
        this.gear[slot].name = gearSetup[slot].name;
        this.gear[slot].id = gearSetup[slot].id;

        if (slot == 3) {
          this.updateAttackStyle(gearSetup[slot].id);
        }
      }
      else {
        this.clearGearSlot(slot);
      }
    });
  }

  gearSlotChange(item: Item, slot: number): void {
    this.selectedGearSetup = this.gearSetups['None'];

    if (slot == 3) {
      this.updateAttackStyle(item.id);
    }
  }

  updateAttackStyle(itemId: number): void {
    this.damageSimservice.getAttackStyles(itemId).subscribe((styles: string[]) => {
      this.attackStyles = styles;
      this.selectedAttackStyle = "";
    });
  }

  addPrayer(prayer: string): void {
    this.selectedPrayers.push(prayer);
  }

  removePrayer(prayer: string): void {
    this.selectedPrayers = this.selectedPrayers.filter(p => p !== prayer);
  }
}
