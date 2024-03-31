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

  private abbreviations: Record<string, string[]>;

  constructor(private damageSimService: DamageSimService) {}

  ngOnInit(): void {
    this.damageSimService.allNpcs$.subscribe((allNpcs: Npc[]) => {
      this.allNpcs = allNpcs;
    });

    this.damageSimService.abbreviations$.subscribe((abbreviations) => (this.abbreviations = abbreviations));
  }

  selectedNpcChange(npc: Npc): void {
    this.npcChanged.emit(npc);
  }

  npcFilter(npc: Npc, searchTerm: string): boolean {
    if (!searchTerm) return true;

    const name = npc.name;
    const abbreviations = this.abbreviations[name];

    const isNpcType = (npc: Npc, searchTerm: string): boolean => {
      if (
        npc.isXerician &&
        this.abbreviations['Chambers of Xeric'].some((abb: string) =>
          abb.toLowerCase().includes(searchTerm.toLowerCase())
        )
      ) {
        return true;
      }

      if (
        (npc.isTobEntryMode || npc.isTobNormalMode || npc.isTobHardMode) &&
        this.abbreviations['Theatre of Blood'].some((abb: string) =>
          abb.toLowerCase().includes(searchTerm.toLowerCase())
        )
      ) {
        return true;
      }

      if (npc.isDragon && 'dragon'.includes(searchTerm.toLowerCase())) {
        return true;
      }

      if (npc.isDemon && 'demon'.includes(searchTerm.toLowerCase())) {
        return true;
      }

      if (npc.isKalphite && 'kalphite'.includes(searchTerm.toLowerCase())) {
        return true;
      }

      if (npc.isUndead && 'undead'.includes(searchTerm.toLowerCase())) {
        return true;
      }

      return false;
    };

    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      name
        .replace(/[^0-9a-z]/gi, '')
        .toLowerCase()
        .includes(searchTerm.replace(/[^0-9a-z]/gi, '').toLowerCase()) ||
      abbreviations?.some((abb: string) => abb.toLowerCase().includes(searchTerm.toLowerCase())) ||
      isNpcType(npc, searchTerm)
    );
  }
}
