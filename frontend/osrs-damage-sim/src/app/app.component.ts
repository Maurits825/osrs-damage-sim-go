import { Component, ComponentRef, ViewChild } from '@angular/core';
import { GearSetupTabComponent } from './gear-setup-tab/gear-setup-tab.component';
import { GearSetupTabsComponent } from './gear-setup-tabs/gear-setup-tabs.component';
import { GearSetupComponent } from './gear-setup/gear-setup.component';
import { GearInputSetup, InputSetup } from './model/input-setup.model';
import { NpcInputComponent } from './npc-input/npc-input.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild(GearSetupTabsComponent) gearSetupTabsComponent: GearSetupTabsComponent;
  @ViewChild(NpcInputComponent) npcInputComponent: NpcInputComponent;

  submit(): void {
    const inputSetup: InputSetup = {
      npc: this.npcInputComponent.selectedNpcId,
      gearInputSetups: []
    };

    this.gearSetupTabsComponent.gearSetupTabs.forEach((gearSetupTab: GearSetupTabComponent) => {
      const gearInputSetups: GearInputSetup[] = [];
      gearSetupTab.gearSetups.forEach((gearSetupRef: ComponentRef<GearSetupComponent>) => {
        gearInputSetups.push(gearSetupRef.instance.getGearInputSetup());
      });

      inputSetup.gearInputSetups.push(gearInputSetups);
    });

    console.log(inputSetup);
  }
}
