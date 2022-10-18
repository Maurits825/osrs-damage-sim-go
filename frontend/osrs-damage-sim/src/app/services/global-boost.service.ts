import { EventEmitter, Injectable } from '@angular/core';

@Injectable()
export class GlobalBoostService {
    globalBoostsChanged = new EventEmitter<string[]>();
    selectedBoosts: string[] = [];

    constructor() { }

    getGlobalBoosts(): string[] {
        return this.selectedBoosts;
    }
    
    addGlobalBoost(boost: string): void {
        this.selectedBoosts.push(boost);
        this.globalBoostsChanged.emit(this.selectedBoosts);
    }

    removeGlobalBoost(boost: string): void {
        this.selectedBoosts = this.selectedBoosts.filter(b => b !== boost);
        this.globalBoostsChanged.emit(this.selectedBoosts);
    }
}
