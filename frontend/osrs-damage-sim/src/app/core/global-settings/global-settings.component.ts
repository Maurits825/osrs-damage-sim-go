import { Component, OnInit } from '@angular/core';
import { Boost } from '../../model/osrs/boost.model';
import { GlobalSettings } from '../../model/damage-sim/input-setup.model';
import { Npc } from '../../model/osrs/npc.model';
import { TOA_PATH_LVL_NPCS, TOA_NPCS } from '../../shared/npc-input/npc.const';
import { BoostService } from '../../services/boost.service';
import { Prayer } from 'src/app/model/osrs/prayer.model';
import { allAttackTypes, AttackType } from 'src/app/model/osrs/item.model';
import { PrayerService } from 'src/app/services/prayer.service';

@Component({
  selector: 'app-global-settings',
  templateUrl: './global-settings.component.html',
  styleUrls: ['./global-settings.component.css'],
})
export class GlobalSettingsComponent implements OnInit {
  globalSettings: GlobalSettings = {
    npcId: null,
    iterations: 10000,
    teamSize: 1,
    raidLevel: 0,
    pathLevel: 0,
  };

  showPathLevel = false;
  showRaidLevel = false;

  selectedBoosts: Set<Boost> = new Set();

  allAttackTypes = allAttackTypes;
  selectedPrayers: Record<AttackType, Set<Prayer>> = {
    magic: new Set(['augury']),
    melee: new Set(['piety']),
    ranged: new Set(['rigour']),
  };
  quickPrayers: Record<AttackType, Set<Prayer>> = {
    magic: new Set(['augury']),
    melee: new Set(['piety']),
    ranged: new Set(['rigour']),
  };

  loading = false;

  constructor(private boostService: BoostService, private prayerService: PrayerService) {}

  ngOnInit(): void {
    this.prayerService.globalPrayers$.next(this.selectedPrayers);
  }

  npcChanged(npc: Npc): void {
    this.globalSettings.npcId = npc.id;

    const npcName = npc.name;
    this.showPathLevel = false;
    this.showRaidLevel = false;

    if (TOA_PATH_LVL_NPCS.includes(npcName)) {
      this.showPathLevel = true;
      this.showRaidLevel = true;
    } else if (TOA_NPCS.includes(npcName)) {
      this.showRaidLevel = true;
      this.globalSettings.pathLevel = 0;
    } else {
      this.globalSettings.raidLevel = 0;
      this.globalSettings.pathLevel = 0;
    }
  }

  toggleBoost(boost: Boost): void {
    this.boostService.toggleBoost(boost, this.selectedBoosts);
    this.boostService.globalBoosts$.next(this.selectedBoosts);
  }

  toggleAttackTypePrayer(prayer: Prayer, attackType: AttackType): void {
    this.prayerService.togglePrayer(prayer, this.selectedPrayers[attackType]);
    this.prayerService.globalPrayers$.next(this.selectedPrayers);
  }
}
