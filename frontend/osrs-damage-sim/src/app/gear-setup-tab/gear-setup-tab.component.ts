import { Component, ComponentRef, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { GearSetupComponent } from '../gear-setup/gear-setup.component';

@Component({
  selector: 'app-gear-setup-tab',
  templateUrl: './gear-setup-tab.component.html',
  styleUrls: ['./gear-setup-tab.component.css']
})
export class GearSetupTabComponent implements OnInit {
  @Input() active = false;
  @ViewChild('gearSetupsContainer', { read: ViewContainerRef }) gearSetupsContainer!: ViewContainerRef;
  
  id: number = 0;
  
  gearSetups: ComponentRef<GearSetupComponent>[] = [];
  
  constructor() { }

  ngOnInit(): void {
  }

  addNewGearSetup(): void {
    let gearSetupRef = this.gearSetupsContainer.createComponent(GearSetupComponent)
    gearSetupRef.instance.setupCount = this.gearSetups.length + 1;
    gearSetupRef.instance.gearSetUpTabRef = this;

    this.gearSetups.push(gearSetupRef);
  }

  removeGearSetup(id: number): void {
    let gearSetupRef = this.gearSetups.find(setup => setup.instance.setupCount == id);

    let gearSetupsContainerIndex: number = this.gearSetupsContainer.indexOf(gearSetupRef!.hostView);

    this.gearSetupsContainer.remove(gearSetupsContainerIndex);

    this.gearSetups = this.gearSetups.filter(
      setup => setup.instance.setupCount !== id
    );

    for (let index = 0; index < this.gearSetups.length; index++) {
      this.gearSetups[index].instance.setupCount = index + 1;
    }
  }

}
