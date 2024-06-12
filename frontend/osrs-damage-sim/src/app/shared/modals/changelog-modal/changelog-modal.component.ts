import { Component } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-changelog',
  templateUrl: './changelog-modal.component.html',
})
export class ChangelogModalComponent {
  constructor(public activeModal: NgbActiveModal, private modalService: NgbModal) {}
}
