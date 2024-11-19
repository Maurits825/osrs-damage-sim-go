import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TrailblazerRelic } from '../model/osrs/leagues/trailblazer-relics.model';
import { StatDrain } from '../model/shared/stat-drain.model';
import { Boost } from '../model/osrs/boost.model';
import { AttackType } from '../model/osrs/item.model';
import { DEFAULT_PRAYERS, Prayer } from '../model/osrs/prayer.model';
import { CombatStats, DEFAULT_COMBAT_STATS } from '../model/osrs/skill.type';
import { replaceBoosts } from '../model/osrs/boost-replace.const';
import { replacePrayers } from '../model/osrs/prayer-replace.const';
import { DEFAULT_RAGING_ECHOES_SETTINGS, RagingEchoesSettings } from '../model/osrs/leagues/raging-echoes.model';

@Injectable({
  providedIn: 'root',
})
export class SharedSettingsService {
  boosts$: BehaviorSubject<Set<Boost>> = new BehaviorSubject(new Set());

  combatStats$: BehaviorSubject<CombatStats> = new BehaviorSubject(DEFAULT_COMBAT_STATS);

  prayers$: BehaviorSubject<Record<AttackType, Set<Prayer>>> = new BehaviorSubject(DEFAULT_PRAYERS);

  statDrain$: BehaviorSubject<StatDrain[]> = new BehaviorSubject([]);

  attackCycle$: BehaviorSubject<number> = new BehaviorSubject(0);

  trailblazerRelics$: BehaviorSubject<Set<TrailblazerRelic>> = new BehaviorSubject(new Set());
  ragingEchoesSettings$: BehaviorSubject<RagingEchoesSettings> = new BehaviorSubject(DEFAULT_RAGING_ECHOES_SETTINGS);

  public togglePrayer(prayer: Prayer, selectedPrayers: Set<Prayer>): void {
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

  public toggleBoost(boost: Boost, selectedBoosts: Set<Boost>): void {
    if (selectedBoosts.has(boost)) {
      selectedBoosts.delete(boost);
    } else {
      if (replaceBoosts[boost]) {
        for (const replacePrayer of replaceBoosts[boost]) {
          selectedBoosts.delete(replacePrayer);
        }
      }
      selectedBoosts.add(boost);
    }
  }
}
