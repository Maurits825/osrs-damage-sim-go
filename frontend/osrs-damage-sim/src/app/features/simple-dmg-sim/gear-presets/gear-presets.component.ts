import { Component, EventEmitter, Output } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { DEFAULT_GEAR_SETUP } from 'src/app/model/shared/gear-setup.model';
import { GearSetup } from 'src/app/model/shared/gear-setup.model';

@Component({
  selector: 'app-gear-presets',
  templateUrl: './gear-presets.component.html',
})
export class GearPresetsComponent {
  @Output()
  selectGearSetup = new EventEmitter<GearSetup | null>();

  maxGearPresets = 50;
  gearPresets: GearSetup[] = [];

  activeIndex: number | null = null;

  addNewGearPreset(gearSetup?: GearSetup): void {
    this.gearPresets.push(cloneDeep(gearSetup) ?? { ...cloneDeep(DEFAULT_GEAR_SETUP), setupName: 'Preset' });

    this.activeIndex = this.gearPresets.length - 1;
    this.editGearPreset(this.activeIndex);
  }

  removeGearPreset(gearSetup: GearSetup): void {
    const index = this.gearPresets.indexOf(gearSetup);
    if (index >= 0) {
      this.gearPresets.splice(index, 1);
    }

    this.selectGearSetup.emit(null);
    this.activeIndex = null;
  }

  editGearPreset(index: number): void {
    this.activeIndex = index;
    this.selectGearSetup.emit(this.gearPresets[index]);
  }
}
