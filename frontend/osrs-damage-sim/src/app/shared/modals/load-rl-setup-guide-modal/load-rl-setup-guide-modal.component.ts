import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-load-rl-setup-guide-modal',
  templateUrl: './load-rl-setup-guide-modal.component.html',
  styleUrls: ['./load-rl-setup-guide-modal.component.css'],
})
export class LoadRlSetupGuideModalComponent {
  constructor(public activeModal: NgbActiveModal) {}
}
