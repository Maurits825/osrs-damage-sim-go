import { Component, EventEmitter, Output } from '@angular/core';
import { CombatStats } from 'src/app/model/osrs/skill.type';
import { DamageSimService } from 'src/app/services/damage-sim.service';

@Component({
  selector: 'app-highscore-lookup',
  templateUrl: './highscore-lookup.component.html',
  styleUrls: ['./highscore-lookup.component.css'],
})
export class HighscoreLookupComponent {
  @Output()
  loadCombatStats = new EventEmitter<CombatStats>();

  loading = false;
  rsnFound: boolean;

  constructor(private damageSimService: DamageSimService) {}

  lookupHighscore(rsn: string): void {
    if (rsn) {
      this.loading = true;
      this.damageSimService.lookupHighscore(rsn).subscribe({
        next: (combatStats: CombatStats) => {
          this.loadCombatStats.emit(combatStats);
          this.loading = false;
          this.rsnFound = true;
        },
        error: () => {
          this.loading = false;
          this.rsnFound = false;
        },
      });
    }
  }
}
