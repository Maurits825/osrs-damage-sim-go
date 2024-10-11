import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TrailblazerRelic } from '../model/osrs/leagues/trailblazer-relics.model';
import { StatDrain } from '../model/shared/stat-drain.model';
import { Boost } from '../model/osrs/boost.model';
import { AttackType } from '../model/osrs/item.model';
import { Prayer } from '../model/osrs/prayer.model';
import { CombatStats } from '../model/osrs/skill.type';
import { replaceBoosts } from '../model/osrs/boost-replace.const';
import { replacePrayers } from '../model/osrs/prayer-replace.const';

@Injectable({
  providedIn: 'root',
})
export class GlobalSettingsService {
  globalBoosts$: BehaviorSubject<Set<Boost>> = new BehaviorSubject(new Set());

  globalCombatStats$: BehaviorSubject<CombatStats> = new BehaviorSubject({
    attack: 99,
    strength: 99,
    ranged: 99,
    magic: 99,
    hitpoints: 99,
    defence: 99,
  });

  globalPrayers$: BehaviorSubject<Record<AttackType, Set<Prayer>>> = new BehaviorSubject(null);

  globalStatDrain$: BehaviorSubject<StatDrain[]> = new BehaviorSubject([]);

  globalAttackCycle$: BehaviorSubject<number> = new BehaviorSubject(0);

  globalTrailblazerRelics$: BehaviorSubject<Set<TrailblazerRelic>> = new BehaviorSubject(new Set());

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
