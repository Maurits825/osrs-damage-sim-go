import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UnitTest } from './unit-test.model';
import { DpsCalcInputService } from 'src/app/services/dps-calc-input.service';
import { InputSetup } from 'src/app/model/damage-sim/input-setup.model';

@Component({
  selector: 'app-unit-test-modal',
  templateUrl: './unit-test-modal.component.html',
})
export class UnitTestModalComponent {
  unitTests: Record<string, UnitTest>;

  constructor(public activeModal: NgbActiveModal, private inputSetupService: DpsCalcInputService) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.readFile(file);
    }
  }

  readFile(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      const fileContent = reader.result as string;
      try {
        this.unitTests = JSON.parse(fileContent);
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    };
    reader.readAsText(file);
  }

  loadSetup(inputSetup: InputSetup): void {
    const setup = this.inputSetupService.parseInputSetupFromJson(inputSetup);
    this.inputSetupService.loadInputSetup$.next(setup);
    this.activeModal.dismiss();
  }
}
