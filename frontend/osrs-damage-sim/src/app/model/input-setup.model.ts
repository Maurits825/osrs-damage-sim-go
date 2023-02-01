import { Condition } from './condition.model';

export interface InputSetup {
  iterations: number;
  npcId: number;
  gearInputSetups: GearInputSetup[][];

  raidLevel: number;
  pathLevel: number;
  teamSize: number;
}

export interface GearInputSetup {
  name: string;
  gear: number[]; //TODO make this Record<number, number> --> gearSlot: id
  weapon: number;
  blowpipeDarts: number;

  attackStyle: string;
  spell: string;

  isSpecial: boolean;
  prayers: string[];
  combatStats: Record<string, number>;
  boosts: string[];

  isFill: boolean;
  conditions: Condition[];

  isOnSlayerTask: boolean;
  isInWilderness: boolean;

  maxHp: number;
  currentHp: number;

  miningLvl: number;

  isKandarinDiary: boolean;
}
