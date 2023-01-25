import { Component, ComponentRef, ViewChild } from '@angular/core';
import { damageSimResults } from './damage-sim-results.const';
import { GearSetupTabComponent } from './gear-setup-tab/gear-setup-tab.component';
import { GearSetupTabsComponent } from './gear-setup-tabs/gear-setup-tabs.component';
import { GearSetupComponent } from './gear-setup/gear-setup.component';
import { DamageSimResults } from './model/damage-sim-results.model';
import { GearInputSetup, InputSetup } from './model/input-setup.model';
import { NpcInputComponent } from './npc-input/npc-input.component';
import { DamageSimService } from './services/damage-sim.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild(GearSetupTabsComponent) gearSetupTabsComponent: GearSetupTabsComponent;
  @ViewChild(NpcInputComponent) npcInputComponent: NpcInputComponent;

  iterations: number = 10000;
  teamSize: number = 1;

  targetTimeChance: number[];

  loading = false;

  damageSimResults: DamageSimResults = damageSimResults;

  constructor(private damageSimservice: DamageSimService) {}

  submit(): void {
    this.loading = true;

    const inputSetup: InputSetup = {
      iterations: this.iterations,
      teamSize: this.teamSize,
      npcId: this.npcInputComponent.selectedNpc.id,
      gearInputSetups: [],
      raidLevel: this.npcInputComponent.raidLevel,
      pathLevel: this.npcInputComponent.pathLeveL,
    };

    this.gearSetupTabsComponent.gearSetupTabs.forEach((gearSetupTab: GearSetupTabComponent) => {
      const gearInputSetups: GearInputSetup[] = [];
      gearSetupTab.gearSetups.forEach((gearSetupRef: ComponentRef<GearSetupComponent>) => {
        gearInputSetups.push(gearSetupRef.instance.getGearInputSetup());
      });

      inputSetup.gearInputSetups.push(gearInputSetups);
    });

    this.damageSimservice.runDamageSim(inputSetup).subscribe(
      (results: DamageSimResults) => {
        this.damageSimResults = results;
        this.loading = false;
      },
      (error) => {
        //TODO show some error
        this.loading = false;
      }
    );
  }
}
