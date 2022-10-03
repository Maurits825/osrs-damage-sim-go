import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-general-setup',
  templateUrl: './general-setup.component.html',
  styleUrls: ['./general-setup.component.css']
})
export class GeneralSetupComponent implements OnInit {
  skills: string[] = ["attack", "strength", "ranged", "magic"];

  skillLevel: Map<string, number> = new Map;

  boosts: string[] = ["smelling_salts", "super_combat_pot", "ranged_pot"]
  selectedBoosts: string[] = [];

  constructor(
    ) {
  }

  ngOnInit(): void {
    this.skills.forEach(skill => {
      this.skillLevel.set(skill, 99);
    });
  }

  addBoost(boost: string): void {
    this.selectedBoosts.push(boost);
  }

  removeBoost(boost: string): void {
    this.selectedBoosts = this.selectedBoosts.filter(b => b !== boost);
  }
}
