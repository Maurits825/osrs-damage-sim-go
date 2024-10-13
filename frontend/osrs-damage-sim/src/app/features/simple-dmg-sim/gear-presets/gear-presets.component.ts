import { Component, EventEmitter, Output } from '@angular/core';
import { DEFAULT_GEAR_SETUP } from 'src/app/model/shared/gear-setup.model';
import { GearSetup } from 'src/app/model/shared/gear-setup.model';

@Component({
  selector: 'app-gear-presets',
  templateUrl: './gear-presets.component.html',
})
export class GearPresetsComponent {
  @Output()
  selectGearSetup = new EventEmitter<GearSetup>();

  maxGearPresets = 50;
  gearPresets: GearSetup[] = [];

  addNewGearPreset(): void {
    this.gearPresets.push({ ...DEFAULT_GEAR_SETUP, setupName: 'gear-preset' });
    console.log(this.gearPresets);
  }

  removeGearPreset(gearSetup: GearSetup): void {
    const index = this.gearPresets.indexOf(gearSetup);
    if (index >= 0) {
      this.gearPresets.splice(index, 1);
    }
  }

  editGearPreset(gearSetup: GearSetup): void {
    this.selectGearSetup.emit(gearSetup);
  }
}
