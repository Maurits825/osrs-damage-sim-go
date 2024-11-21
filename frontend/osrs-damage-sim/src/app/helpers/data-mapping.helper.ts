import { PartialDeep } from 'type-fest';
import { NpcInfo } from '../model/osrs/npc.model';
import { GlobalSettings } from '../model/shared/global-settings.model';

export function mapNpcInfoToGlobalSettings(npcInfo: NpcInfo): PartialDeep<GlobalSettings> {
  return {
    npc: npcInfo.npc,
    raidLevel: npcInfo.raidLevel,
    pathLevel: npcInfo.pathLevel,
    overlyDraining: npcInfo.overlyDraining,
    coxScaling: {
      isChallengeMode: npcInfo.isChallengeMode,
    },
  };
}

export function mapGlobalSettingsToNpcInfo(globalSettings: GlobalSettings): NpcInfo {
  return {
    npc: globalSettings.npc,
    raidLevel: globalSettings.raidLevel,
    pathLevel: globalSettings.pathLevel,
    overlyDraining: globalSettings.overlyDraining,
    isChallengeMode: globalSettings.coxScaling.isChallengeMode,
  };
}
