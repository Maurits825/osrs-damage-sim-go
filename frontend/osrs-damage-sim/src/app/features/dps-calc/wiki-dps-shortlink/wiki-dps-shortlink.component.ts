import { Component } from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap/popover/popover';
import { DamageSimService } from 'src/app/services/damage-sim.service';
import { DpsCalcInputService } from 'src/app/services/dps-calc-input.service';

@Component({
  selector: 'app-wiki-dps-shortlink',
  templateUrl: './wiki-dps-shortlink.component.html',
})
export class WikiDpsShortlinkComponent {
  loading = false;

  constructor(private damageSimservice: DamageSimService, private inputSetupService: DpsCalcInputService) {}
  getWikiDpsShortlink(popover: NgbPopover): void {
    this.loading = true;
    const inputSetupJson = this.inputSetupService.getInputSetupAsJson();

    this.damageSimservice.getWikiDpsShortlink(inputSetupJson).subscribe({
      next: (shortlinkString: string) => {
        this.loading = false;
        window.open(shortlinkString, '_blank');
      },
      error: ({ error: { error } }) => {
        this.loading = false;
        const errorMessage = error[0].toUpperCase() + error.slice(1);
        popover.open({ error: errorMessage });
      },
    });
  }
}
