import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { allPrayers, Prayer } from 'src/app/model/osrs/prayer.model';
import { PrayerModalComponent } from '../prayer-modal/prayer-modal.component';
import { disabledPrayers } from './disabled-prayers.const';

@Component({
  selector: 'app-prayer-selection',
  templateUrl: './prayer-selection.component.html',
  styleUrls: ['./prayer-selection.component.css'],
})
export class PrayerSelectionComponent implements OnInit {
  @Input()
  selectedPrayers: Set<Prayer>;

  @Output()
  prayerToggle = new EventEmitter<Prayer>();

  allPrayers = allPrayers;
  quickPrayers: Set<Prayer> = new Set(['piety', 'rigour', 'augury']);
  quickPrayerSelected = true;

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {
    this.quickPrayerSelected = this.isOnlyQuickPrayerSelected();
  }

  open() {
    const prayerModal = this.modalService.open(PrayerModalComponent, { size: 'sm', animation: false });
    prayerModal.componentInstance.selectedPrayers = this.selectedPrayers;
    prayerModal.componentInstance.disabledPrayers = disabledPrayers;
    prayerModal.componentInstance.prayerToggle.subscribe((prayer: Prayer) => {
      this.togglePrayer(prayer);
    });
  }

  togglePrayer(prayer: Prayer): void {
    this.prayerToggle.emit(prayer);
    this.quickPrayerSelected = this.isOnlyQuickPrayerSelected();
  }

  isOnlyQuickPrayerSelected(): boolean {
    for (const selectedPrayer of this.selectedPrayers) {
      if (!this.quickPrayers.has(selectedPrayer)) {
        return false;
      }
    }
    return true;
  }
}
