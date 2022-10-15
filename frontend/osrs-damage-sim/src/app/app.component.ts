import { Component, ComponentRef, ViewChild } from '@angular/core';
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

  damageSimResults: DamageSimResults = {
    ttk_stats: [
      {
        average: "1:43.6",
        maximum: "1:43.6",
        minimum: "1:43.6",
        most_frequent: "1:43.6",
        
        chance_to_kill: ["0:23.6","1:10.6","2:43.6"],
        
        label: "Max Tbow",
      },
      {
        average: "1:23.6",
        maximum: "1:23.6",
        minimum: "1:23.6",
        most_frequent: "1:13.6",
        
        chance_to_kill: ["0:23.6","1:23.6","2:43.6"],
        
        label: "Max Tbow 2",
      },
    ],
    total_dmg_stats: [[
      {
        average: "50",
        maximum: "",
        minimum: "",
        most_frequent: "",
        
        chance_to_kill: [],
        
        label: "Max BGS",
      },
      {
        average: "30",
        maximum: "",
        minimum: "",
        most_frequent: "",
        
        chance_to_kill: [],
        
        label: "Max claws",
      },
      {
        average: "240",
        maximum: "",
        minimum: "",
        most_frequent: "",
        
        chance_to_kill: [],
        
        label: "Max tbow",
      },
    ], [
      {
        average: "24",
        maximum: "",
        minimum: "",
        most_frequent: "",
        
        chance_to_kill: [],
        
        label: "Max claws",
      },
      {
        average: "260",
        maximum: "",
        minimum: "",
        most_frequent: "",
        
        chance_to_kill: [],
        
        label: "Max tbow",
      },
    ]],
    sim_dps_stats: [[
      {
        average: "5.6",
        maximum: "",
        minimum: "",
        most_frequent: "",
        
        chance_to_kill: [],
        
        label: "Max BGS",
      },
      {
        average: "20.2",
        maximum: "",
        minimum: "",
        most_frequent: "",
        
        chance_to_kill: [],
        
        label: "Max claws",
      },
      {
        average: "8.7",
        maximum: "",
        minimum: "",
        most_frequent: "",
        
        chance_to_kill: [],
        
        label: "Max tbow",
      },
    ], [
      {
        average: "19.4",
        maximum: "",
        minimum: "",
        most_frequent: "",
        
        chance_to_kill: [],
        
        label: "Max claws",
      },
      {
        average: "8.5",
        maximum: "",
        minimum: "",
        most_frequent: "",
        
        chance_to_kill: [],
        
        label: "Max tbow",
      },
    ]],
    theoretical_dps: [[5.4, 20.3, 8.3], [20.1, 8.1]],
    cummulative_chances: [[0, 0.5, 0.7, 1], [0, 0.2, 0.4, 0.9]],
  };

  loading = false;

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
    console.log(targetTime);
    const matches = targetTime.match(/^([0-9]*):([0-9]*)\.([0-9]*)$/);
    console.log(matches);

    const targetSeconds = (+matches[1] * 60) + +matches[2] + +matches[3]/10;
    console.log(targetSeconds);
    const targetTicks = Math.ceil(targetSeconds / 0.6);
    console.log(targetTicks);

    this.targetTimeChance = [];
    debugger;
    this.damageSimResults.cummulative_chances.forEach((chances: number[]) => {
      this.targetTimeChance.push(chances[targetTicks])
    });
  }
}
