import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { Npc } from '../model/osrs/npc.model';
import { DamageSimService } from '../services/damage-sim.service';

@Component({
  selector: 'app-npc-input',
  templateUrl: './npc-input.component.html',
  styleUrls: ['./npc-input.component.css'],
})
export class NpcInputComponent implements OnInit {
  @Output()
  npcChanged = new EventEmitter<Npc>();

  allNpcs: Npc[];

  selectedNpc: Npc;

  npcBuffer: Npc[];
  bufferSize = 50;
  numberOfItemsFromEndBeforeFetchingMore = 10;

  loading = false;
  input$ = new Subject<string>();

  constructor(private damageSimservice: DamageSimService) {}

  ngOnInit(): void {
    this.damageSimservice.allNpcs$.subscribe((allNpcs: Npc[]) => {
      this.allNpcs = allNpcs;
      this.npcBuffer = this.allNpcs.slice(0, this.bufferSize);
    });

    this.onSearch();
  }

  selectedNpcChange(npc: Npc): void {
    this.npcChanged.emit(npc);
  }

  onScrollToEnd(searchTerm: string): void {
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
    }, 1);
  }

  onSearch(): void {
    this.input$.pipe(distinctUntilChanged()).subscribe((searchTerm) => {
      this.npcBuffer = this.allNpcs.filter((npc: Npc) => this.npcFilter(npc, searchTerm)).slice(0, this.bufferSize);
    });
  }

  npcFilter(npc: Npc, searchTerm: string): boolean {
    if (!searchTerm) return true;
    return npc.name.toLowerCase().includes(searchTerm.toLowerCase());
  }
}
