import { Component } from '@angular/core';
import { DamageSimService } from 'src/app/services/damage-sim.service';
import { InputSetupService } from 'src/app/services/input-setup.service';

@Component({
  selector: 'app-wiki-dps-shortlink',
  templateUrl: './wiki-dps-shortlink.component.html',
})
export class WikiDpsShortlinkComponent {
  constructor(private damageSimservice: DamageSimService, private inputSetupService: InputSetupService) {}
  getWikiDpsShortlink(): void {
    const inputSetupJson = this.inputSetupService.getInputSetupAsJson();

    this.damageSimservice.getWikiDpsShortlink(inputSetupJson).subscribe({
      next: (shortlinkString: string) => {
        console.log(shortlinkString);
      },
    });
  }
}
