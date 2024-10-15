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
  @Input()
  gearSimSetups: GearSimSetup[];

  GearSetup: GearSetup;

  allGearPresets: GearSetup[];
  //TODO a bit annoying having to maintain two lists
  selectedGearPresets: GearSetup[] = [];

  maxSimSetups = 50;

  constructor(private inputService: SimpleDmgSimInputService) {}

  ngOnInit(): void {
    this.allGearPresets = this.inputService.getGearSetups();
    this.gearSimSetups.forEach((setup: GearSimSetup) =>
      this.selectedGearPresets.push(this.allGearPresets[setup.gearPresetIndex])
    );
  }

  addNewSimSetup(gearSimSetup?: GearSimSetup): void {
    this.gearSimSetups.push(cloneDeep(gearSimSetup) ?? { gearPresetIndex: 0 });
    this.selectedGearPresets.push(null);
  }

  removeSimSetup(index: number): void {
    this.gearSimSetups.splice(index, 1);
    this.selectedGearPresets.splice(index, 1);
  }

  selectedGearPresetChange(gearSetup: GearSetup, index: number): void {
    this.selectedGearPresets[index] = gearSetup;
  }
}
