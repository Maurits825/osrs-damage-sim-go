import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CombatStats } from '../model/osrs/skill.type';

@Injectable({
  providedIn: 'root',
})
export class CombatStatService {
  globalCombatStats$: BehaviorSubject<CombatStats> = new BehaviorSubject(null);

  constructor() {}
}
