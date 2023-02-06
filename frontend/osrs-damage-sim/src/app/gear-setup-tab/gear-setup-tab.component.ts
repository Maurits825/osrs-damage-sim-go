import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  Injector,
  Input,
  Optional,
  SkipSelf,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { GearSetupComponent } from '../gear-setup/gear-setup.component';

@Component({
  selector: 'app-gear-setup-tab',
  templateUrl: './gear-setup-tab.component.html',
  styleUrls: ['./gear-setup-tab.component.css'],
})
export class GearSetupTabComponent implements AfterViewInit {
  @Input() active = false;
  @ViewChild('gearSetupsContainer', { read: ViewContainerRef }) gearSetupsContainer!: ViewContainerRef;

  id: number = 0;

  gearSetups: ComponentRef<GearSetupComponent>[] = [];

  constructor(
    private changeDetector: ChangeDetectorRef,
    @SkipSelf() @Optional() private gearSetupTabToCopy: GearSetupTabComponent
  ) {}

  public ngAfterViewInit(): void {
    if (this.gearSetupTabToCopy) {
      this.gearSetupTabToCopy.gearSetups.forEach((gearSetupRef: ComponentRef<GearSetupComponent>) => {
        this.addNewGearSetup(gearSetupRef.instance);
      });
    } else {
      this.addNewGearSetup();
    }

    this.changeDetector.detectChanges();
  }

  addNewGearSetup(gearToCopy?: GearSetupComponent): void {
    let gearSetupRef;

    if (gearToCopy) {
      const injector: Injector = Injector.create({
        providers: [{ provide: GearSetupComponent, useValue: gearToCopy }],
      });
      gearSetupRef = this.gearSetupsContainer.createComponent(GearSetupComponent, { injector: injector });
    } else {
      gearSetupRef = this.gearSetupsContainer.createComponent(GearSetupComponent);
    }

    gearSetupRef.instance.setupCount = this.gearSetups.length + 1;
    gearSetupRef.instance.gearSetupTabRef = this;

    this.gearSetups.push(gearSetupRef);
  }

  removeGearSetup(id: number): void {
    let gearSetupRef = this.gearSetups.find((setup) => setup.instance.setupCount == id);

    let gearSetupsContainerIndex: number = this.gearSetupsContainer.indexOf(gearSetupRef.hostView);

    this.gearSetupsContainer.remove(gearSetupsContainerIndex);

    this.gearSetups = this.gearSetups.filter((setup) => setup.instance.setupCount !== id);

    for (let index = 0; index < this.gearSetups.length; index++) {
      this.gearSetups[index].instance.setupCount = index + 1;
    }
  }
}
