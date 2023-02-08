import { Injectable } from '@angular/core';
import { replacePrayers } from '../model/osrs/prayer-replace.const';
import { Prayer } from '../model/osrs/prayer.model';

@Injectable({
  providedIn: 'root',
})
export class PrayerService {
  constructor() {}

  togglePrayer(prayer: Prayer, selectedPrayers: Set<Prayer>): void {
    if (selectedPrayers.has(prayer)) {
      selectedPrayers.delete(prayer);
    } else {
      if (replacePrayers[prayer]) {
        for (const replacePrayer of replacePrayers[prayer]) {
          selectedPrayers.delete(replacePrayer);
        }
      }
      selectedPrayers.add(prayer);
    }
  }
}
