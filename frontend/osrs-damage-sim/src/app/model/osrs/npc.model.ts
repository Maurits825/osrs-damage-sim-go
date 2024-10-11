export interface NpcInfo {
  npc: Npc;
  raidLevel: number;
  pathLevel: number;
  overlyDraining: boolean;
  isChallengeMode: boolean;
}

export interface Npc {
  name: string;
  id: number;
  combat: number;
  hitpoints: number;
  isKalphite: boolean;
  isDemon: boolean;
  isDragon: boolean;
  isUndead: boolean;
  isLeafy: boolean;
  isXerician: boolean;
  isShade: boolean;
  isTobEntryMode: boolean;
  isTobNormalMode: boolean;
  isTobHardMode: boolean;
  respawn?: number;
}
