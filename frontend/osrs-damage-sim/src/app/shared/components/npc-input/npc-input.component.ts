import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Npc, NpcInfo } from 'src/app/model/osrs/npc.model';
import { StaticDataService } from 'src/app/services/static-data.service';
import { TOA_NPCS, TOA_PATH_LVL_NPCS } from './npc.const';
import { npcFuzzySearch } from 'src/app/helpers/npc-filter.helper';
import { take } from 'rxjs';

@Component({
  selector: 'app-npc-input',
  templateUrl: './npc-input.component.html',
})
export class NpcInputComponent implements OnInit, OnChanges {
  @Input()
  npcInfo: NpcInfo;

  @Output()
  npcInfoChanged = new EventEmitter<NpcInfo>();

  allNpcs: Npc[];
  Npc: Npc;

  showPathLevel = false;
  showRaidLevel = false;
  showIsChallengeMode = false;

  private abbreviations: Record<string, string[]>;

  constructor(private staticDataService: StaticDataService) {}

  ngOnInit(): void {
    this.staticDataService.allNpcs$.pipe(take(1)).subscribe((allNpcs: Npc[]) => {
      this.allNpcs = allNpcs;
    });

    this.staticDataService.abbreviations$
      .pipe(take(1))
      .subscribe((abbreviations) => (this.abbreviations = abbreviations));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['npcInfo']) {
      this.selectedNpcChange(this.npcInfo.npc);
    }
  }

  onNpcInfoChanged(): void {
    this.npcInfoChanged.emit(this.npcInfo);
  }

  selectedNpcChange(npc: Npc): void {
    this.npcInfo.npc = npc;
    if (!npc) return;

    const npcName = npc.name;
    this.showPathLevel = false;
    this.showRaidLevel = false;
    this.showIsChallengeMode = npc.isXerician;
    this.npcInfo.isChallengeMode = this.showIsChallengeMode ? this.npcInfo.isChallengeMode : false;

    if (TOA_PATH_LVL_NPCS.includes(npcName)) {
      this.showPathLevel = true;
      this.showRaidLevel = true;
    } else if (TOA_NPCS.find((n) => npcName.includes(n))) {
      this.showRaidLevel = true;
      this.npcInfo.pathLevel = 0;
    } else {
      this.npcInfo.raidLevel = 0;
      this.npcInfo.pathLevel = 0;
    }

    this.npcInfoChanged.emit(this.npcInfo);
  }

  npcFilter(npc: Npc, searchTerm: string): boolean {
    return npcFuzzySearch(npc, searchTerm, this.abbreviations);
  }
}
