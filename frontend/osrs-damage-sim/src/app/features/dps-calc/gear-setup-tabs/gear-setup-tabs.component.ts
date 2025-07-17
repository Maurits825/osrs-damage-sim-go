import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { InputGearSetup, InputSetup } from 'src/app/model/dps-calc/input-setup.model';
import { DpsCalcInputService } from 'src/app/services/dps-calc-input.service';
import { cloneDeep } from 'lodash-es';

@Component({
  selector: 'app-gear-setup-tabs',
  templateUrl: './gear-setup-tabs.component.html',
})
export class GearSetupTabsComponent implements OnInit, OnDestroy {
  inputGearSetups: InputGearSetup[] = [
    {
      gearSetupSettings: null,
      gearSetup: null,
    },
  ];
  activeTab = 0;

  @Input()
  maxSetupTabs = 5;

  private destroyed$ = new Subject();

  constructor(
    private inputSetupService: DpsCalcInputService,
    private changeDetector: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.inputSetupService.loadInputSetup$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((inputSetup: InputSetup) => this.loadInputSetup(inputSetup.inputGearSetups));

    //TODO this is scuffed?
    this.inputSetupService.inputGearSetupProvider = { getInputGearSetup: () => this.inputGearSetups };
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
        gearSetup: null,
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
