import { EventEmitter, Injectable } from '@angular/core';

@Injectable()
export class GlobalBoostService {
  boostsChanged = new EventEmitter<string[]>();
  boostsAdded = new EventEmitter<string>();
  boostsRemoved = new EventEmitter<string>();
  selectedBoosts: string[] = [];

  constructor() {}

  getGlobalBoosts(): string[] {
    return this.selectedBoosts;
  }

  addGlobalBoost(boost: string): void {
    this.selectedBoosts.push(boost);
    this.boostsAdded.emit(boost);
    this.boostsChanged.emit(this.selectedBoosts);
  }

  removeGlobalBoost(boost: string): void {
    this.selectedBoosts = this.selectedBoosts.filter((b) => b !== boost);
    this.boostsRemoved.emit(boost);
    this.boostsChanged.emit(this.selectedBoosts);
  }
}
