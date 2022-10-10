import { Component, OnInit } from '@angular/core';
import { Npc } from '../model/npc.model';
import { DamageSimService } from '../services/damage-sim.service';

@Component({
  selector: 'app-npc-input',
  templateUrl: './npc-input.component.html',
  styleUrls: ['./npc-input.component.css']
})
export class NpcInputComponent implements OnInit {
  allNpcs: Record<number, Npc>;
  selectedNpc: Npc;

  constructor(private damageSimservice: DamageSimService) { }

  ngOnInit(): void {
    this.damageSimservice.getAllNpcs().subscribe((allNpcs: Record<number, Npc>) => this.allNpcs = allNpcs);
  }

  selectedNpcChange(event: any): void {
    console.log(event);
  }

}
