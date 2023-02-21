import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardService } from 'ngx-clipboard';
import { GlobalSettings, InputSetup } from 'src/app/model/damage-sim/input-setup.model';
import { InputSetupService } from 'src/app/services/input-setup.service';
import { ShareInputSetupModalComponent } from 'src/app/shared/share-input-setup-modal/share-input-setup-modal.component';
import { GearSetupTabsComponent } from '../gear-setup-tabs/gear-setup-tabs.component';

@Component({
  selector: 'app-share-input-setup',
  templateUrl: './share-input-setup.component.html',
  styleUrls: ['./share-input-setup.component.css'],
})
export class ShareInputSetupComponent {
  @Input() globalSettings: GlobalSettings;
  @Input() gearSetupTabsComponent: GearSetupTabsComponent;

  setupString: string;

  constructor(
    private modalService: NgbModal,
    private inputSetupService: InputSetupService,
    private clipboardService: ClipboardService
  ) {}

  importSetup(): void {}

  getSetupString(): string {
    const inputSetupJson = this.inputSetupService.getInputSetupAsJson(this.globalSettings, this.gearSetupTabsComponent);

    return window.btoa(inputSetupJson);
  }

  openModal() {
    const shareSetupModal = this.modalService.open(ShareInputSetupModalComponent, { animation: false });

    this.setupString = this.getSetupString();
    shareSetupModal.componentInstance.setupString = this.setupString;

    shareSetupModal.componentInstance.loadSetup.subscribe((setup: string) => {
      this.loadSetup(setup);
    });

    shareSetupModal.componentInstance.copySetupToClipboard.subscribe(() => {
      this.copySetupToClipboard();
    });
  }

  loadSetup(setup: string): void {
    setup = this.setupString;
    if (!setup) return;

    console.log('setup', setup);
    const inputSetupJson = window.atob(setup);
    const inputSetup = this.inputSetupService.parseInputSetup(inputSetupJson);
    console.log(inputSetup);
    //TODO will have to mostly likely populate items somewhere with items from allGearSlots
  }

  copySetupToClipboard(): void {
    this.clipboardService.copy(this.setupString);
  }
}
