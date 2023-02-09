import { Boost } from '../osrs/boost.model';
import { Condition } from './condition.model';
import { GearSlot } from '../osrs/gear-slot.enum';
import { Item } from '../osrs/item.model';
import { CombatStats } from '../osrs/skill.type';
import { Prayer } from '../osrs/prayer.model';

export interface InputSetup {
  globalSettings: GlobalSettings;
  gearInputSetups: GearInputSetup[][];
}

export interface GlobalSettings {
  iterations: number;
  npcId: number;

  raidLevel: number;
  pathLevel: number;

  teamSize: number;
}

export interface GearInputSetup {
  setupName: string;
  gear: Record<GearSlot, Item>;
  blowpipeDarts: number;

  attackStyle: string;
  spell: string;

  isSpecial: boolean;
  prayers: Set<Prayer>;
  combatStats: CombatStats;
  boosts: Set<Boost>;

  isFill: boolean;
  conditions: Condition[];

  isOnSlayerTask: boolean;
  isInWilderness: boolean;

  currentHp: number;

  miningLvl: number;

  isKandarinDiary: boolean;
}
