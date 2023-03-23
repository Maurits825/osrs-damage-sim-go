import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DamageSimResults } from './model/damage-sim/damage-sim-results.model';
import { DamageSimService } from './services/damage-sim.service';
import { InputSetupService } from './services/input-setup.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  loading = false;

  damageSimResults: DamageSimResults;

  isDamageSimActive = false;
  damageSimServiceUrl = environment.OSRS_DAMAGE_SIM_SERVICE_URL + '/status';

  constructor(private damageSimservice: DamageSimService, private inputSetupService: InputSetupService) {}

  ngOnInit(): void {
    this.damageSimservice.getStatus().subscribe({
      next: () => {
        this.isDamageSimActive = true;
      },
      error: () => {
        this.isDamageSimActive = false;
      },
    });
  }

  runDamageSim(): void {
    this.loading = true;

    const inputSetupJson = this.inputSetupService.getInputSetupAsJson();

    this.damageSimservice.runDamageSim(inputSetupJson).subscribe({
      next: (results: DamageSimResults) => {
        this.loading = false;
        this.damageSimResults = results;
      },
      error: (error) => {
        this.loading = false;
        this.damageSimResults = { ...this.damageSimResults, error: error.statusText };
      },
    });
  }
}
