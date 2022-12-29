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
  styleUrls: ['./app.component.css']
})
export class AppComponent { //TODO refactor to another component?
  @ViewChild(GearSetupTabsComponent) gearSetupTabsComponent: GearSetupTabsComponent;
  @ViewChild(NpcInputComponent) npcInputComponent: NpcInputComponent;

  iterations: number = 10000;
  teamSize: number = 1;

  targetTimeChance: number[];

  loading = false;

  damageSimResults = damageSimResults;

  constructor(private damageSimservice: DamageSimService) {}

  submit(): void {
    this.loading = true;

    const inputSetup: InputSetup = {
      iterations: this.iterations,
      teamSize: this.teamSize,
      npc: this.npcInputComponent.selectedNpcId,
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

    this.damageSimservice.runDamageSim(inputSetup).subscribe((results: DamageSimResults) => {
      this.damageSimResults = results;
      this.loading = false;
    },
    error => {
      //TODO show some error
      this.loading = false;
    });
  }

  targetTimeChanged(targetTime: string): void {
    const matches = targetTime.match(/^([0-9]*):([0-9]*)\.([0-9]*)$/);

    const targetSeconds = (+matches[1] * 60) + +matches[2] + +matches[3]/10;
    const targetTicks = Math.ceil(targetSeconds / 0.6);

    this.targetTimeChance = [];
    this.damageSimResults.cumulative_chances.forEach((chances: number[]) => {
      this.targetTimeChance.push(chances[targetTicks])
    });
  }
}
