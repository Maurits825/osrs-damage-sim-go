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
  gearSetupId: number = 0;
  
  constructor() { }

  ngOnInit(): void {
  }

  addNewGearSetup(): void {
    let gearSetupRef = this.gearSetupsContainer.createComponent(GearSetupComponent)
    gearSetupRef.instance.setupId = ++this.gearSetupId;
    gearSetupRef.instance.gearSetUpTabRef = this;

    this.gearSetups.push(gearSetupRef);
  }

  removeGearSetup(id: number): void {
    let gearSetupRef = this.gearSetups.find(setup => setup.instance.setupId == id);

    let gearSetupsContainerIndex: number = this.gearSetupsContainer.indexOf(gearSetupRef!.hostView);

    this.gearSetupsContainer.remove(gearSetupsContainerIndex);

    this.gearSetups = this.gearSetups.filter(
      setup => setup.instance.setupId !== id
    );
  }

}
