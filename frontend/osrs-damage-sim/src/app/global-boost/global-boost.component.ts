import { Component, EventEmitter, OnInit } from '@angular/core';
import { POTIONS } from '../constants.const';
import { GlobalBoostService } from '../services/global-boost.service';

@Component({
  selector: 'app-global-boost',
  templateUrl: './global-boost.component.html',
  styleUrls: ['./global-boost.component.css']
})
export class GlobalBoostComponent implements OnInit {
  boosts: string[] = POTIONS;
  selectedBoosts: string[] = [];

  globalBoostsChanged = new EventEmitter<string[]>();

  constructor(private globalBoostService: GlobalBoostService) { }

  ngOnInit(): void {
    this.globalBoostService.globalBoostsChanged.subscribe(boosts => this.selectedBoosts = [...boosts]);
  }

  addBoost(boost: string): void {
    this.globalBoostService.addGlobalBoost(boost);
  }

  removeBoost(boost: string): void {
    this.globalBoostService.removeGlobalBoost(boost);
  }
}
