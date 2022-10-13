import { AfterViewInit, ChangeDetectorRef, Component, ComponentRef, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { GearSetupComponent } from '../gear-setup/gear-setup.component';

@Component({
  selector: 'app-gear-setup-tab',
  templateUrl: './gear-setup-tab.component.html',
  styleUrls: ['./gear-setup-tab.component.css']
})
export class GearSetupTabComponent implements OnInit, AfterViewInit {
  @Input() active = false;
  @ViewChild('gearSetupsContainer', { read: ViewContainerRef }) gearSetupsContainer!: ViewContainerRef;
  
  id: number = 0;
  
  gearSetups: ComponentRef<GearSetupComponent>[] = [];

  tabToCopy: GearSetupTabComponent;
  
  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  public ngAfterViewInit(): void {
    //TODO is there a chance that this gets called before tabToCopy is set?
    if (this.tabToCopy) {
      this.tabToCopy.gearSetups.forEach((gearSetupRef: ComponentRef<GearSetupComponent>) => {
        this.addNewGearSetup(gearSetupRef.instance);
      });
    }
    this.cd.detectChanges();
  }

  addNewGearSetup(gearToCopy?: GearSetupComponent): void {
    let gearSetupRef = this.gearSetupsContainer.createComponent(GearSetupComponent)
    if (gearToCopy) {
      gearSetupRef.instance.gearToCopy = gearToCopy;
    }

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
