import { Component, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { GearSetupComponent } from '../gear-setup/gear-setup.component';

@Component({
  selector: 'app-general-setup',
  templateUrl: './general-setup.component.html',
  styleUrls: ['./general-setup.component.css']
})
export class GeneralSetupComponent implements OnInit {
  @ViewChild('gearSetupsContainer', { read: ViewContainerRef }) gearSetupsContainer!: ViewContainerRef;
  gearSetups: ComponentRef<GearSetupComponent>[] = [];
  gearSetupId: number = 0;

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

  addNewGearSetup(): void {
    let gearSetupRef = this.gearSetupsContainer.createComponent(GearSetupComponent)
    gearSetupRef.instance.setupId = ++this.gearSetupId;
    gearSetupRef.instance.generalSetupComponentRef = this;

    this.gearSetups.push(gearSetupRef);
  }

  removeGearSetup(id: number): void {
    let gearSetupRef = this.gearSetups.find(setup => setup.instance.setupId == id);

    let gearSetupsContainerIndex: number = this.gearSetupsContainer.indexOf(gearSetupRef!.hostView);

    // removing component from gearSetupsContainerIndex
    this.gearSetupsContainer.remove(gearSetupsContainerIndex);

    // removing component from the list
    this.gearSetups = this.gearSetups.filter(
      setup => setup.instance.setupId !== id
    );
  }
}
