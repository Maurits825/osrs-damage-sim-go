import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DamageSimService } from './services/damage-sim.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  isDamageSimActive = false;
  damageSimServiceUrl = environment.OSRS_DAMAGE_SIM_SERVICE_URL + '/status';

  constructor(private damageSimservice: DamageSimService) {}

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
}
