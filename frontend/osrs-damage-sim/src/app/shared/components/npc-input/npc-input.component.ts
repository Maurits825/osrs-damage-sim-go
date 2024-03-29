import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Npc } from 'src/app/model/osrs/npc.model';
import { DamageSimService } from 'src/app/services/damage-sim.service';

@Component({
  selector: 'app-npc-input',
  templateUrl: './npc-input.component.html',
  styleUrls: ['./npc-input.component.css'],
})
export class NpcInputComponent implements OnInit {
  @Input()
  selectedNpc: Npc;

  @Output()
  npcChanged = new EventEmitter<Npc>();

  allNpcs: Npc[];

  Npc: Npc;

  constructor(private damageSimservice: DamageSimService) {}

  ngOnInit(): void {
    this.damageSimservice.allNpcs$.subscribe((allNpcs: Npc[]) => {
      this.allNpcs = allNpcs;
    });
  }

  selectedNpcChange(npc: Npc): void {
    this.npcChanged.emit(npc);
  }
}
