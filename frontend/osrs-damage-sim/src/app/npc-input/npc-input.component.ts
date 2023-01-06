import { Component, OnInit } from '@angular/core';
import { Npc } from '../model/npc.model';
import { DamageSimService } from '../services/damage-sim.service';
import { TOA_NPCS, TOA_PATH_LVL_NPCS } from './npc.const';

@Component({
  selector: 'app-npc-input',
  templateUrl: './npc-input.component.html',
  styleUrls: ['./npc-input.component.css']
})
export class NpcInputComponent implements OnInit {
  allNpcs: Record<number, Npc>;
  selectedNpcId: number;

  raidLevel: number = 0;
  pathLeveL: number = 0;
  showPathLevel = false;
  showRaidLevel = false;

  constructor(private damageSimservice: DamageSimService) { }

  ngOnInit(): void {
    this.damageSimservice.getAllNpcs().subscribe((allNpcs: Record<number, Npc>) => this.allNpcs = allNpcs);
  }

  selectedNpcChange(npcId: number): void {
    const npcName = this.allNpcs[npcId].name;
    this.showPathLevel = false;
    this.showRaidLevel = false;

    if (TOA_PATH_LVL_NPCS.includes(npcName)){
      this.showPathLevel = true;
      this.showRaidLevel = true;
    }
    else if (TOA_NPCS.includes(npcName)) {
      this.showRaidLevel = true;
    }
  }
}
