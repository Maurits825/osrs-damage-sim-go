import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, map, shareReplay } from 'rxjs';
import { UserSettings } from 'src/app/model/shared/user-settings.model';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { LoadRlSetupGuideModalComponent } from '../load-rl-setup-guide-modal/load-rl-setup-guide-modal.component';
import { GearSetupPreset } from 'src/app/model/shared/gear-preset.model';
import { InputGearSetupPreset } from 'src/app/model/dps-calc/input-setup.model';

type DeleteConfig = {
  label: string;
  count$: Observable<number>;
  delete: () => void;
};

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
})
export class SettingsModalComponent implements OnInit {
  userSettings$: Observable<UserSettings>;
  totalSavedGearSetups$: Observable<number>;
  totalSavedInputPresets$: Observable<number>;

  deleteConfigs: DeleteConfig[];
  selectedConfig?: DeleteConfig;

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private localStorageService: LocalStorageService,
  ) {}

  ngOnInit(): void {
    this.userSettings$ = this.localStorageService.userSettingsWatch$;
    this.totalSavedGearSetups$ = this.localStorageService.gearSetupWatch$.pipe(
      map((presets: GearSetupPreset[]) => presets.length),
      shareReplay(1),
    );

    this.totalSavedInputPresets$ = this.localStorageService.inputPresetWatch$.pipe(
      map((presets: InputGearSetupPreset[]) => presets.length),
      shareReplay(1),
    );

    this.deleteConfigs = [
      {
        label: 'saved gear setups',
        count$: this.totalSavedGearSetups$,
        delete: () => this.localStorageService.deleteAllGearSetups(),
      },
      {
        label: 'saved input presets',
        count$: this.totalSavedInputPresets$,
        delete: () => this.localStorageService.deleteAllInputPresets(),
      },
    ];
  }

  updateUserSettings(userSettings: UserSettings): void {
    this.localStorageService.saveUserSettings(userSettings);
  }

  openConfirmationModal(content: TemplateRef<unknown>, config: DeleteConfig): void {
    this.selectedConfig = config;
    this.modalService.open(content, { animation: false, centered: true });
  }

  deleteAllGearSetups(): void {
    this.localStorageService.deleteAllGearSetups();
  }

  deleteAllInputPresets(): void {
    this.localStorageService.deleteAllInputPresets();
  }

  openLoadRuneliteGuide(): void {
    this.modalService.open(LoadRlSetupGuideModalComponent, { animation: false, size: 'lg' });
  }
}
