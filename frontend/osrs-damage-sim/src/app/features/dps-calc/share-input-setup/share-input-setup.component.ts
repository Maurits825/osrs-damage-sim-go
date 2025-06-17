import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardService } from 'ngx-clipboard';
import { DpsCalcInputService } from 'src/app/services/dps-calc-input.service';
import { ShareInputSetupModalComponent } from 'src/app/shared/modals/share-input-setup-modal/share-input-setup-modal.component';

@Component({
  selector: 'app-share-input-setup',
  templateUrl: './share-input-setup.component.html',
})
export class ShareInputSetupComponent {
  setupString: string;

  constructor(
    private modalService: NgbModal,
    private inputSetupService: DpsCalcInputService,
    private clipboardService: ClipboardService,
  ) {}

  getInputSetupString(): string {
    const inputSetupJson = this.inputSetupService.getInputSetupAsJson();

    return window.btoa(inputSetupJson);
  }

  openModal() {
    const shareSetupModal = this.modalService.open(ShareInputSetupModalComponent, { animation: false });

    this.setupString = this.getInputSetupString();
    shareSetupModal.componentInstance.setupString = this.setupString;

    shareSetupModal.componentInstance.loadSetup.subscribe((encodedString: string) => {
      const isValidSetup = this.loadInputSetup(encodedString);

      shareSetupModal.componentInstance.isValidSetup = isValidSetup;
    });

    shareSetupModal.componentInstance.copySetupToClipboard.subscribe(() => {
      this.copySetupToClipboard();
    });
  }

  copySetupToClipboard(): void {
    this.clipboardService.copy(this.setupString);
  }

  loadInputSetup(encodedString: string): boolean {
    if (!encodedString) return false;

    let inputSetup;
    try {
      inputSetup = this.inputSetupService.parseInputSetupFromEncodedString(encodedString);
    } catch {
      return false;
    }

    this.inputSetupService.loadInputSetup$.next(inputSetup);
    return true;
  }
}
