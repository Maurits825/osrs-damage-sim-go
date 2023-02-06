import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-prayer-modal',
  templateUrl: './prayer-modal.component.html',
  styleUrls: ['./prayer-modal.component.css'],
})
export class PrayerModalComponent implements OnInit {
  @Input() name: any;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {}
}
