import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DamageSimService } from './services/damage-sim.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SettingsModalComponent } from './shared/modals/settings-modal/settings-modal.component';
import { ChangelogModalComponent } from './shared/modals/changelog-modal/changelog-modal.component';
import { UnitTestModalComponent } from './shared/modals/unit-test-modal/unit-test-modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  isDamageSimActive = false;
  damageSimServiceUrl = environment.OSRS_DAMAGE_SIM_SERVICE_URL + '/status';

  isDev = !environment.production;

  constructor(private damageSimservice: DamageSimService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.damageSimservice.getStatus().subscribe({
      next: () => {
        this.isDamageSimActive = true;
      },
      error: () => {
        this.isDamageSimActive = false;
      },
    });
  }

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
