import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { allPrayers, Prayer } from 'src/app/model/osrs/prayer.model';
import { PrayerModalComponent } from '../prayer-modal/prayer-modal.component';

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

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {}

  open() {
    const prayerModal = this.modalService.open(PrayerModalComponent, { size: 'sm', animation: false });
    prayerModal.componentInstance.selectedPrayers = this.selectedPrayers;
    prayerModal.componentInstance.prayerToggle.subscribe((prayer: Prayer) => {
      this.togglePrayer(prayer);
    });
  }

  removePrayer(prayer: Prayer): void {}

  togglePrayer(prayer: Prayer): void {
    this.prayerToggle.emit(prayer);
  }
}
