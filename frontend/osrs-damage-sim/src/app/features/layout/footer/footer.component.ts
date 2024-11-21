import { Component, OnInit } from '@angular/core';
import { DamageSimService } from 'src/app/services/damage-sim.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
})
export class FooterComponent implements OnInit {
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
