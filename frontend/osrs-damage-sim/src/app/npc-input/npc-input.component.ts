import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators'
import { Npc } from '../model/npc.model';
import { DamageSimService } from '../services/damage-sim.service';
import { TOA_NPCS, TOA_PATH_LVL_NPCS } from './npc.const';

@Component({
  selector: 'app-npc-input',
  templateUrl: './npc-input.component.html',
  styleUrls: ['./npc-input.component.css']
})
export class NpcInputComponent implements OnInit {
  allNpcs: Npc[];
  selectedNpc: Npc;

  npcBuffer: Npc[];
  bufferSize = 50;
  numberOfItemsFromEndBeforeFetchingMore = 10;
  loading = false;
  input$ = new Subject<string>();

  raidLevel: number = 0;
  pathLeveL: number = 0;
  showPathLevel = false;
  showRaidLevel = false;

  constructor(private damageSimservice: DamageSimService) { }

  ngOnInit(): void {
    this.damageSimservice.getAllNpcs().subscribe((allNpcs: Npc[]) => {
      this.allNpcs = allNpcs;
      this.npcBuffer = this.allNpcs.slice(0, this.bufferSize);
    });

    this.onSearch();
  }

  selectedNpcChange(npc: Npc): void {
    const npcName = npc.name;
    this.showPathLevel = false;
    this.showRaidLevel = false;

    if (TOA_PATH_LVL_NPCS.includes(npcName)) {
      this.showPathLevel = true;
      this.showRaidLevel = true;
    }
    else if (TOA_NPCS.includes(npcName)) {
      this.showRaidLevel = true;
      this.pathLeveL = 0;
    }
    else {
      this.raidLevel = 0;
      this.pathLeveL = 0;
    }
  }

  onScrollToEnd(searchTerm: string) {
    this.fetchMore(searchTerm);
  }

  fetchMore(searchTerm: string): void {
    const len = this.npcBuffer.length;
    const more = this.allNpcs.filter((npc: Npc) => this.npcFilter(npc, searchTerm)).slice(len, this.bufferSize + len);
    this.loading = true;
    // TODO timeout is needed because otherwise the onScrollToEnd only triggers once, can maybe use OnScroll instead
    setTimeout(() => {
      this.loading = false;
      this.npcBuffer = this.npcBuffer.concat(more);
    }, 1)
  }

  onSearch(): void {
    this.input$.pipe(
      distinctUntilChanged(),
    )
      .subscribe(searchTerm => {
        this.npcBuffer = this.allNpcs.filter((npc: Npc) => this.npcFilter(npc, searchTerm)).slice(0, this.bufferSize);
      })
  }

  npcFilter(npc: Npc, searchTerm: string): boolean {
    if (!searchTerm) return true;
    return npc.name.toLowerCase().includes(searchTerm.toLowerCase());
  }
}
