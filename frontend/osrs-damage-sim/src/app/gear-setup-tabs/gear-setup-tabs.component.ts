import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { GearSetupTabComponent } from '../gear-setup-tab/gear-setup-tab.component';

@Component({
  selector: 'app-gear-setup-tabs',
  templateUrl: './gear-setup-tabs.component.html',
  styleUrls: ['./gear-setup-tabs.component.css']
})
export class GearSetupTabsComponent implements OnInit {
  @ViewChild('gearSetupTabContainer', {read: ViewContainerRef}) gearSetupTabContainer!: ViewContainerRef;
  gearSetupTabs: GearSetupTabComponent[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  openNewSetupTab(tabToCopy?: GearSetupTabComponent): void {
    let gearSetupTabRef = this.gearSetupTabContainer.createComponent(GearSetupTabComponent);

    if (tabToCopy) {
      gearSetupTabRef.instance.tabToCopy = tabToCopy;
    }

    // set the according properties on our component instance
    const tabInstance: GearSetupTabComponent = gearSetupTabRef.instance as GearSetupTabComponent;
    tabInstance.id = this.gearSetupTabs.length + 1; //TODO kinda scuffed

    // remember the dynamic component for rendering the
    // tab navigation headers
    this.gearSetupTabs.push(tabInstance);

    // set it active
    this.selectTab(tabInstance);
  }

  selectTab(tab: GearSetupTabComponent): void {
    // deactivate all tabs
    this.gearSetupTabs.forEach((gearSetupTab) => (gearSetupTab.active = false));

    // activate the tab the user has clicked on.
    tab.active = true;
  }

  closeTab(tab: GearSetupTabComponent): void {
    for (let i = 0; i < this.gearSetupTabs.length; i++) {
      if (this.gearSetupTabs[i] === tab) {
        // remove the tab from our array
        this.gearSetupTabs.splice(i, 1);

        let viewContainerRef = this.gearSetupTabContainer;
        viewContainerRef.remove(i);

        // set tab index to 1st one
        if (this.gearSetupTabs.length > 1) {
          this.selectTab(this.gearSetupTabs[0]);
          break;
        }
      }
    }
  }

  copyTab(tabToCopy: GearSetupTabComponent): void {
    this.openNewSetupTab(tabToCopy);
  }
}
