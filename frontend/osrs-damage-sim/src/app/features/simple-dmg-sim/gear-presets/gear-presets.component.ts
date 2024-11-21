import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { DEFAULT_GEAR_SETUP } from 'src/app/model/shared/gear-setup.model';
import { GearSetup } from 'src/app/model/shared/gear-setup.model';
import { SimpleDmgSimInputService } from 'src/app/services/simple-dmg-sim-input.service';

@Component({
  selector: 'app-gear-presets',
  templateUrl: './gear-presets.component.html',
})
export class GearPresetsComponent implements OnInit {
  @Output()
  selectGearSetup = new EventEmitter<GearSetup | null>();

  maxGearPresets = 50;
  gearPresets: GearSetup[];

  activeIndex: number | null = null;

  constructor(private inputService: SimpleDmgSimInputService) {}

  ngOnInit(): void {
    this.inputService.gearSetupPresetsWatch().subscribe((presets: GearSetup[]) => (this.gearPresets = presets));
  }

  addNewGearPreset(gearSetup?: GearSetup): void {
    this.gearPresets.push(cloneDeep(gearSetup) ?? { ...cloneDeep(DEFAULT_GEAR_SETUP), setupName: 'Preset Name' });

    this.activeIndex = this.gearPresets.length - 1;
    this.editGearPreset(this.activeIndex);
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
