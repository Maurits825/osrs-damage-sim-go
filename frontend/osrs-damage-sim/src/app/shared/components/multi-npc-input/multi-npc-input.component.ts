import { Component, EventEmitter, Output } from '@angular/core';
import { take } from 'rxjs';
import { mapGlobalSettingsToNpcInfo } from 'src/app/helpers/data-mapping.helper';
import { npcFuzzySearch } from 'src/app/helpers/npc-filter.helper';
import { Npc, NpcInfo } from 'src/app/model/osrs/npc.model';
import { DEFAULT_GLOBAL_SETTINGS } from 'src/app/model/shared/global-settings.model';
import { StaticDataService } from 'src/app/services/static-data.service';

@Component({
  selector: 'app-multi-npc-input',
  templateUrl: './multi-npc-input.component.html',
})
export class MultiNpcInputComponent {
  @Output()
  npcInfoChanged = new EventEmitter<NpcInfo>();

  @Output()
  multiNpcsChanged = new EventEmitter<Npc[]>();

  npcInfo: NpcInfo = mapGlobalSettingsToNpcInfo(DEFAULT_GLOBAL_SETTINGS);
  npcs: Npc[] = [];

  Npc: Npc;

  allNpcs: Npc[];
  abbreviations: Record<string, string[]>;

  constructor(private staticDataService: StaticDataService) {}

  ngOnInit(): void {
    this.staticDataService.allNpcs$.pipe(take(1)).subscribe((allNpcs: Npc[]) => {
      this.allNpcs = allNpcs;
    });

    this.staticDataService.abbreviations$
      .pipe(take(1))
      .subscribe((abbreviations) => (this.abbreviations = abbreviations));
  }

  selectedNpcChange(npc: Npc): void {
    this.npcInfo.npc = npc;
  }

  addNpc(): void {
    this.npcs.push(this.npcInfo.npc);
    this.multiNpcsChanged.emit(this.npcs);
  }

  removeNpc(npc: Npc): void {
    const index = this.npcs.indexOf(npc);
    if (index >= 0) {
      this.npcs.splice(index, 1);
    }
    this.multiNpcsChanged.emit(this.npcs);
  }

  npcFilter(npc: Npc, searchTerm: string): boolean {
    return npcFuzzySearch(npc, searchTerm, this.abbreviations);
  }
}
