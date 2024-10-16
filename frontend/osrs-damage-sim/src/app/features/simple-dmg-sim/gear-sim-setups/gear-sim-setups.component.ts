import { Component, Input, OnInit } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { GearSetup } from 'src/app/model/shared/gear-setup.model';
import { GearSimSetup } from 'src/app/model/simple-dmg-sim/input-setup.model';
import { SimpleDmgSimInputService } from 'src/app/services/simple-dmg-sim-input.service';

@Component({
  selector: 'app-gear-sim-setups',
  templateUrl: './gear-sim-setups.component.html',
})
export class GearSimSetupsComponent implements OnInit {
  //TODO could just use input service to get this data?
  //should these component be depended on input service only, or have @input?
  @Input()
  gearSimSetups: GearSimSetup[];

  @Input()
  mainGearSimSetup: GearSimSetup;

  GearSetup: GearSetup;

  allGearPresets: GearSetup[];
  //TODO a bit annoying having to maintain two lists
  selectedGearPresets: GearSetup[] = [];
  selectedMainGearSetup: GearSetup;

  maxSimSetups = 50;

  constructor(private inputService: SimpleDmgSimInputService) {}

  ngOnInit(): void {
    this.allGearPresets = this.inputService.getGearSetupPresets();

    this.gearSimSetups.forEach((setup: GearSimSetup) =>
      this.selectedGearPresets.push(this.allGearPresets[setup.gearPresetIndex])
    );
    this.selectedMainGearSetup = this.allGearPresets[0];
  }

  addNewSimSetup(gearSimSetup?: GearSimSetup): void {
    const defaultIndex = 0;
    this.gearSimSetups.push(cloneDeep(gearSimSetup) ?? { gearPresetIndex: defaultIndex, conditions: [] });
    this.selectedGearPresets.push(this.allGearPresets[defaultIndex]);
  }

  removeSimSetup(index: number): void {
    this.gearSimSetups.splice(index, 1);
    this.selectedGearPresets.splice(index, 1);
  }

  selectedGearPresetChange(gearSetup: GearSetup, index: number): void {
    this.selectedGearPresets[index] = gearSetup;
    this.gearSimSetups[index].gearPresetIndex = this.allGearPresets.findIndex((s) => s === gearSetup);
  }

  selectedMainGearChange(gearSetup: GearSetup): void {
    this.selectedMainGearSetup = gearSetup;
    this.mainGearSimSetup.gearPresetIndex = this.allGearPresets.findIndex((s) => s === gearSetup);
  }
}
