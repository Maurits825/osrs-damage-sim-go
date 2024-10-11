import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Npc, NpcInfo } from 'src/app/model/osrs/npc.model';
import { StaticDataService } from 'src/app/services/static-data.service';
import { TOA_NPCS, TOA_PATH_LVL_NPCS } from './npc.const';

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
    this.staticDataService.allNpcs$.subscribe((allNpcs: Npc[]) => {
      this.allNpcs = allNpcs;
    });

    this.staticDataService.abbreviations$.subscribe((abbreviations) => (this.abbreviations = abbreviations));
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

    if (TOA_PATH_LVL_NPCS.includes(npcName)) {
      this.showPathLevel = true;
      this.showRaidLevel = true;
    } else if (TOA_NPCS.includes(npcName)) {
      this.showRaidLevel = true;
      this.npcInfo.pathLevel = 0;
    } else {
      this.npcInfo.raidLevel = 0;
      this.npcInfo.pathLevel = 0;
    }

    this.npcInfoChanged.emit(this.npcInfo);
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
