import { Condition } from "./condition.model";

export interface InputSetup {
    iterations: number,
    npc: number,
    gearInputSetups: GearInputSetup[][],

    raidLevel: number,
    pathLevel: number,
    teamSize: number,
}

export interface GearInputSetup {
    name: string,
    gear: number[],
    weapon: number,
    blowpipeDarts: number,
    attackStyle: string,
    attackCount: number,
    isSpecial: boolean,
    prayers: string[],
    combatStats: Record<string, number>,
    boosts: string[],
    isFill: boolean,
    conditions: Condition[],
}
