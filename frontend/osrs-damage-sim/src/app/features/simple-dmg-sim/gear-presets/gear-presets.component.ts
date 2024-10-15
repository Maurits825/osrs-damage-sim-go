import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { DEFAULT_GEAR_SETUP } from 'src/app/model/shared/gear-setup.model';
import { GearSetup } from 'src/app/model/shared/gear-setup.model';
import { SimpleDmgSimInputService } from 'src/app/services/simple-dmg-sim-input.service';
import { GEAR_SETUPS_MOCK } from './gear-presets.mock';

@Component({
  selector: 'app-gear-presets',
  templateUrl: './gear-presets.component.html',
})
export class GearPresetsComponent implements OnInit {
  @Output()
  selectGearSetup = new EventEmitter<GearSetup | null>();

  maxGearPresets = 50;
  //TODO remove this later, make actual mock setups???
  gearPresets: GearSetup[] = GEAR_SETUPS_MOCK;

  activeIndex: number | null = null;

  constructor(private inputService: SimpleDmgSimInputService) {}

  ngOnInit(): void {
    this.inputService.setGearSetupsProvider(() => this.gearPresets);
  }

  addNewGearPreset(gearSetup?: GearSetup): void {
    this.gearPresets.push(cloneDeep(gearSetup) ?? { ...cloneDeep(DEFAULT_GEAR_SETUP), setupName: 'Preset' });

    this.activeIndex = this.gearPresets.length - 1;
    this.editGearPreset(this.activeIndex);
    console.log(this.gearPresets);
  }

  removeGearPreset(index: number): void {
    this.gearPresets.splice(index, 1);

    this.selectGearSetup.emit(null);
    this.activeIndex = null;
  }

  editGearPreset(index: number): void {
    this.activeIndex = index;
    this.selectGearSetup.emit(this.gearPresets[index]);
  }
}
