import { Component } from '@angular/core';
import { ChangelogModalComponent } from 'src/app/shared/modals/changelog-modal/changelog-modal.component';
import { SettingsModalComponent } from 'src/app/shared/modals/settings-modal/settings-modal.component';
import { UnitTestModalComponent } from 'src/app/shared/modals/unit-test-modal/unit-test-modal.component';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  isDev = !environment.production;

  constructor(private modalService: NgbModal) {}
  openSettingsModal(): void {
    this.modalService.open(SettingsModalComponent, { animation: false, centered: true });
  }

  openChangelogModal(): void {
    this.modalService.open(ChangelogModalComponent, { animation: false, centered: true });
  }

  openUnitTestModal(): void {
    this.modalService.open(UnitTestModalComponent, { animation: false, centered: true });
  }
}
