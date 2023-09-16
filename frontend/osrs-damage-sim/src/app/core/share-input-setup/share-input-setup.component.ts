import { Component, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardService } from 'ngx-clipboard';
import {} from 'src/app/model/dps-grapher/dps-grapher-settings.model';
import { Mode } from 'src/app/model/mode.enum';
import { InputSetupService } from 'src/app/services/input-setup.service';
import { ShareInputSetupModalComponent } from 'src/app/shared/modals/share-input-setup-modal/share-input-setup-modal.component';

@Component({
  selector: 'app-share-input-setup',
  templateUrl: './share-input-setup.component.html',
  styleUrls: ['./share-input-setup.component.css'],
})
export class ShareInputSetupComponent {
  @Input()
  mode: Mode = Mode.DamageSim;

  Mode = Mode;

  setupString: string;

  constructor(
    private modalService: NgbModal,
    private inputSetupService: InputSetupService,
    private clipboardService: ClipboardService
  ) {}

  getInputSetupString(): string {
    const inputSetupJson = this.inputSetupService.getInputSetupAsJson();

    return window.btoa(inputSetupJson);
  }

  getDpsGrapherInputString(): string {
    const dpsGrapherInputJson = this.inputSetupService.getDpsGrapherInputAsJson();

    return window.btoa(dpsGrapherInputJson);
  }

  openModal() {
    const shareSetupModal = this.modalService.open(ShareInputSetupModalComponent, { animation: false });

    this.setupString = this.mode == Mode.DamageSim ? this.getInputSetupString() : this.getDpsGrapherInputString();
    shareSetupModal.componentInstance.setupString = this.setupString;

    shareSetupModal.componentInstance.loadSetup.subscribe((encodedString: string) => {
      const isValidSetup =
        this.mode == Mode.DamageSim ? this.loadInputSetup(encodedString) : this.loadDpsGrapherInput(encodedString);

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
    } catch (error) {
      return false;
    }

    this.inputSetupService.loadInputSetup$.next(inputSetup);
    return true;
  }

  loadDpsGrapherInput(encodedString: string): boolean {
    if (!encodedString) return false;

    let dpsGrapherInput;
    try {
      dpsGrapherInput = this.inputSetupService.parseDpsGrapherInputFromEncodedString(encodedString);
    } catch (error) {
      return false;
    }

    this.inputSetupService.loadInputSetup$.next(dpsGrapherInput.inputSetup);
    this.inputSetupService.dpsGrapherSettings$.next(dpsGrapherInput.settings);

    return true;
  }
}
