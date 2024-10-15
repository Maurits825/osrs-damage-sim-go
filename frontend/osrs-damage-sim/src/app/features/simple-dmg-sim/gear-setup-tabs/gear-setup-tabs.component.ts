import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { Subject } from 'rxjs';
import { InputGearSetup } from 'src/app/model/simple-dmg-sim/input-setup.model';

@Component({
  selector: 'app-gear-setup-tabs',
  templateUrl: './gear-setup-tabs.component.html',
})
export class GearSetupTabsComponent implements OnInit {
  inputGearSetups: InputGearSetup[] = [
    {
      gearSetupSettings: null,
      gearSimSetups: [],
    },
  ];
  activeTab = 0;

  maxSetupTabs = 5;

  private destroyed$ = new Subject();

  constructor(private changeDetector: ChangeDetectorRef) {}

  ngOnInit(): void {
    // this.inputSetupService.loadInputSetup$
    //   .pipe(takeUntil(this.destroyed$))
    //   .subscribe((inputSetup: InputSetup) => this.loadInputSetup(inputSetup.inputGearSetups));

    //TODO this is scuffed?
    // this.inputSetupService.inputGearSetupProvider = { getInputGearSetup: () => this.inputGearSetups };
    this.changeDetector.detectChanges();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  openNewSetupTab(inputGearSetupToCopy?: InputGearSetup): void {
    if (inputGearSetupToCopy) {
      this.inputGearSetups.push(cloneDeep(inputGearSetupToCopy));
    } else {
      this.inputGearSetups.push({
        gearSetupSettings: null,
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