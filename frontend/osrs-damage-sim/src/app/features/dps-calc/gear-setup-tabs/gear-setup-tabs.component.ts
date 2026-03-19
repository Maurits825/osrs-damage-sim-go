import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { InputGearSetup, InputGearSetupPreset, InputSetup } from 'src/app/model/dps-calc/input-setup.model';
import { DpsCalcInputService } from 'src/app/services/dps-calc-input.service';
import { cloneDeep } from 'lodash-es';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap/popover/popover';
import { LocalStorageService } from 'src/app/services/local-storage.service';

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

  maxSetupTabs = 10;

  InputGearSetupPreset: InputGearSetupPreset;
  inputGearSetupPresets: InputGearSetupPreset[];
  selectedInputGearSetupPreset: InputGearSetupPreset = { name: '', inputGearSetups: [] };
  inputPresetName = '';

  private destroyed$ = new Subject();

  constructor(
    private inputSetupService: DpsCalcInputService,
    private changeDetector: ChangeDetectorRef,
    private localStorageService: LocalStorageService,
  ) {}

  ngOnInit(): void {
    this.inputSetupService.loadInputSetup$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((inputSetup: InputSetup) => this.loadInputSetup(inputSetup.inputGearSetups));

    this.localStorageService.inputPresetWatch$.subscribe(
      (presets: InputGearSetupPreset[]) => (this.inputGearSetupPresets = presets),
    );

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

  selectedPresetChange(preset: InputGearSetupPreset) {
    this.loadInputSetup(cloneDeep(preset.inputGearSetups));
  }

  savePreset(popover: NgbPopover) {
    const preset = { name: this.inputPresetName, inputGearSetups: [...this.inputGearSetups] };
    this.localStorageService.saveInputPreset(preset).subscribe((error: string | null) => {
      popover.open({ error });
    });
  }

  deletePreset(event: Event, setupName: string): void {
    event.stopPropagation();
    this.localStorageService.deleteInputPreset(setupName);
  }
}
