import { Component, TemplateRef } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { UserSettings } from 'src/app/model/damage-sim/user-settings.model';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.css'],
})
export class SettingsModalComponent {
  userSettings$: Observable<UserSettings>;

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private localStorageService: LocalStorageService
  ) {
    this.userSettings$ = this.localStorageService.userSettingsWatch$;
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
}
