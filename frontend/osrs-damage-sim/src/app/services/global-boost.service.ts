import { EventEmitter, Injectable } from '@angular/core';
import { Boost } from '../model/boost.type';

@Injectable({
  providedIn: 'root',
})
export class GlobalBoostService {
  boostsAdded = new EventEmitter<string>();
  boostsRemoved = new EventEmitter<string>();
  selectedBoosts: Set<Boost> = new Set();

  constructor() {}

  getBoosts(): Set<Boost> {
    return this.selectedBoosts;
  }

  addBoost(boost: Boost): void {
    this.selectedBoosts.add(boost);
    this.boostsAdded.emit(boost);
  }

  removeBoost(boost: Boost): void {
    this.selectedBoosts.delete(boost);
    this.boostsRemoved.emit(boost);
  }
}
