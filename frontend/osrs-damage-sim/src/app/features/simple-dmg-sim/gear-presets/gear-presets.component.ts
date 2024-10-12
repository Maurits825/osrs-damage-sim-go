import { Component } from '@angular/core';
//TODO have this in a shared model?
import { GearSetup } from 'src/app/model/dps-calc/input-setup.model';
import { DEFAULT_GEAR_SETUP } from 'src/app/model/shared/gear-setup.const';

@Component({
  selector: 'app-gear-presets',
  templateUrl: './gear-presets.component.html',
})
export class GearPresetsComponent {
  maxGearPresets = 50;
  gearPresets: GearSetup[] = [];

  addNewGearPreset(): void {
    this.gearPresets.push({ ...DEFAULT_GEAR_SETUP, setupName: 'gear-preset' });
    console.log(this.gearPresets);
  }

  removeGearPreset(preset: GearSetup): void {
    const index = this.gearPresets.indexOf(preset);
    if (index >= 0) {
      this.gearPresets.splice(index, 1);
    }
  }

  editGearPreset(preset: GearSetup): void {
    console.log('edit');
  }
}
