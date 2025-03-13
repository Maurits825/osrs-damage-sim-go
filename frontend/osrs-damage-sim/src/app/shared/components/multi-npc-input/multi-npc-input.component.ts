import { Component, EventEmitter, Input, Output } from '@angular/core';
import { take } from 'rxjs';
import { mapGlobalSettingsToNpcInfo } from 'src/app/helpers/data-mapping.helper';
import { npcFuzzySearch } from 'src/app/helpers/npc-filter.helper';
import { Npc, NpcInfo } from 'src/app/model/osrs/npc.model';
import { DEFAULT_GLOBAL_SETTINGS } from 'src/app/model/shared/global-settings.model';
import { StaticDataService } from 'src/app/services/static-data.service';
import { ALL_MULTI_NPC_PRESETS, MultiNpcPreset } from './multi-npc.model';
import { TOA_NPCS, TOA_PATH_LVL_NPCS } from '../npc-input/npc.const';

@Component({
  selector: 'app-multi-npc-input',
  templateUrl: './multi-npc-input.component.html',
})
export class MultiNpcInputComponent {
  @Input()
  multiNpcs: Npc[] = [];

  @Output()
  npcInfoChanged = new EventEmitter<NpcInfo>();

  @Output()
  multiNpcsChanged = new EventEmitter<Npc[]>();

  npcInfo: NpcInfo = mapGlobalSettingsToNpcInfo(DEFAULT_GLOBAL_SETTINGS);

  Npc: Npc;

  allNpcs: Npc[];
  abbreviations: Record<string, string[]>;

  MultiNpcPreset: MultiNpcPreset;
  multiNpcsPresets: MultiNpcPreset[] = ALL_MULTI_NPC_PRESETS;
  selectedMultiNpcPreset: MultiNpcPreset;

  showPathLevel = false;
  showRaidLevel = false;
  showIsChallengeMode = false;

  constructor(private staticDataService: StaticDataService) {}

  ngOnInit(): void {
    this.staticDataService.allNpcs$.pipe(take(1)).subscribe((allNpcs: Npc[]) => {
      this.allNpcs = allNpcs;
    });

    this.staticDataService.abbreviations$
      .pipe(take(1))
      .subscribe((abbreviations) => (this.abbreviations = abbreviations));
  }

  onNpcChanges(): void {
    //TODO refactor to helper/service for this? kinda dupe from npc-input
    this.showPathLevel = false;
    this.showRaidLevel = false;
    this.showIsChallengeMode = false;

    for (const npc of this.multiNpcs) {
      const npcName = npc.name;
      this.showIsChallengeMode = npc.isXerician ? true : this.showIsChallengeMode;
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
    }

    this.npcInfoChanged.emit(this.npcInfo);
    this.multiNpcsChanged.emit(this.multiNpcs);
  }

  selectedNpcChange(npc: Npc): void {
    this.npcInfo.npc = npc;
  }

  selectedMultiNpcPresetChanged(preset: MultiNpcPreset): void {
    this.selectedMultiNpcPreset = preset;
    this.multiNpcs = this.selectedMultiNpcPreset.ids.map((id) => this.allNpcs.find((npc) => npc.id === id));
    this.onNpcChanges();
  }

  addNpc(): void {
    this.multiNpcs.push(this.npcInfo.npc);
    this.onNpcChanges();
  }

  removeNpc(npc: Npc): void {
    const index = this.multiNpcs.indexOf(npc);
    if (index >= 0) {
      this.multiNpcs.splice(index, 1);
    }
    this.multiNpcsChanged.emit(this.multiNpcs);
  }

  onNpcInfoChanged(): void {
    this.npcInfoChanged.emit(this.npcInfo);
  }

  npcFilter(npc: Npc, searchTerm: string): boolean {
    return npcFuzzySearch(npc, searchTerm, this.abbreviations);
  }
}
