import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { InputGearSetup } from 'src/app/model/simple-dmg-sim/input-setup.model';
import { SimpleDmgSimInputService } from 'src/app/services/simple-dmg-sim-input.service';

@Component({
  selector: 'app-gear-setup-tabs',
  templateUrl: './gear-setup-tabs.component.html',
})
export class GearSetupTabsComponent implements OnInit {
  inputGearSetups: InputGearSetup[];

  activeTab = 0;
  maxSetupTabs = 5;

  constructor(private changeDetector: ChangeDetectorRef, private inputService: SimpleDmgSimInputService) {}

  ngOnInit(): void {
    this.inputService.inputGearSetupsWatch().subscribe((setups: InputGearSetup[]) => (this.inputGearSetups = setups));
    this.changeDetector.detectChanges();
  }

  openNewSetupTab(inputGearSetupToCopy?: InputGearSetup): void {
    //TODO should we call the input service and add there? that technically "owns" the data
    if (inputGearSetupToCopy) {
      this.inputGearSetups.push(cloneDeep(inputGearSetupToCopy));
    } else {
      this.inputGearSetups.push({
        gearSetupSettings: null,
        mainGearSimSetup: { gearPresetIndex: 0, conditions: [] },
        gearSimSetups: [],
      });
    }

    this.selectTab(this.inputGearSetups.length - 1);
    this.changeDetector.detectChanges();
  }

  selectTab(index: number): void {
    this.activeTab = index;
  }

  deleteTab(index: number): void {
    this.inputGearSetups.splice(index, 1);
    if (this.activeTab >= index) {
      this.activeTab = Math.max(0, this.activeTab - 1);
    }
  }

  loadInputSetup(inputGearSetups: InputGearSetup[]): void {
    this.inputGearSetups = inputGearSetups;
  }
}
