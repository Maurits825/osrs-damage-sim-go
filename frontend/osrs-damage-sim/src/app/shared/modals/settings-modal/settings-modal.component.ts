import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, map, shareReplay } from 'rxjs';
import { UserSettings } from 'src/app/model/damage-sim/user-settings.model';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { LoadRlSetupGuideModalComponent } from '../load-rl-setup-guide-modal/load-rl-setup-guide-modal.component';
import { GearSetupPreset } from 'src/app/model/damage-sim/gear-preset.model';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
})
export class SettingsModalComponent implements OnInit {
  userSettings$: Observable<UserSettings>;
  totalSavedGearSetups$: Observable<number>;

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private localStorageService: LocalStorageService
  ) {}
  ngOnInit(): void {
    this.userSettings$ = this.localStorageService.userSettingsWatch$;
    this.totalSavedGearSetups$ = this.localStorageService.gearSetupWatch$.pipe(
      map((presets: GearSetupPreset[]) => presets.length),
      shareReplay(1)
    );
  }

  updateUserSettings(userSettings: UserSettings): void {
    this.localStorageService.saveUserSettings(userSettings);
  }

  openConfirmationModal(content: TemplateRef<unknown>): void {
    this.modalService.open(content, { animation: false, centered: true });
  }

  deleteAllGearSetups(): void {
    this.localStorageService.deleteAllGearSetups();
  }

  openLoadRuneliteGuide(): void {
    this.modalService.open(LoadRlSetupGuideModalComponent, { animation: false, size: 'lg' });
  }
}
