import { AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { GearSetupTabComponent } from '../gear-setup-tab/gear-setup-tab.component';

@Component({
  selector: 'app-gear-setup-tabs',
  templateUrl: './gear-setup-tabs.component.html',
  styleUrls: ['./gear-setup-tabs.component.css']
})
export class GearSetupTabsComponent implements OnInit, AfterViewInit {
  @ViewChild('gearSetupTabContainer', {read: ViewContainerRef}) gearSetupTabContainer!: ViewContainerRef;
  gearSetupTabs: GearSetupTabComponent[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.openNewSetupTab(); //TODO causes ExpressionChangedAfterItHasBeenCheckedError
  }

  openNewSetupTab(tabToCopy?: GearSetupTabComponent): void {
    let gearSetupTabRef = this.gearSetupTabContainer.createComponent(GearSetupTabComponent);

    if (tabToCopy) {
      gearSetupTabRef.instance.tabToCopy = tabToCopy;
    }

    const tabInstance: GearSetupTabComponent = gearSetupTabRef.instance as GearSetupTabComponent;
    tabInstance.id = this.gearSetupTabs.length + 1;

    this.gearSetupTabs.push(tabInstance);

    this.selectTab(tabInstance);
  }

  selectTab(tab: GearSetupTabComponent): void {
    this.gearSetupTabs.forEach((gearSetupTab) => (gearSetupTab.active = false));

    tab.active = true;
  }

  closeTab(tab: GearSetupTabComponent): void {
    for (let i = 0; i < this.gearSetupTabs.length; i++) {
      if (this.gearSetupTabs[i] === tab) {
        this.gearSetupTabs.splice(i, 1);

        let viewContainerRef = this.gearSetupTabContainer;
        viewContainerRef.remove(i);

        if (tab.active && this.gearSetupTabs.length >= 1) {
          this.selectTab(this.gearSetupTabs[i - 1]);
          break;
        }
      }
    }

    for (let index = 0; index < this.gearSetupTabs.length; index++) {
      this.gearSetupTabs[index].id = index + 1;
    }
  }

  copyTab(tabToCopy: GearSetupTabComponent): void {
    this.openNewSetupTab(tabToCopy);
  }
}
