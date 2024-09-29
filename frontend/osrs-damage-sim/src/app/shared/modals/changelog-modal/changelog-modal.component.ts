import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { changeLogData } from './changelog.const';

@Component({
  selector: 'app-changelog',
  templateUrl: './changelog-modal.component.html',
})
export class ChangelogModalComponent {
  changeLogData = changeLogData;
  constructor(public activeModal: NgbActiveModal) {}
}
