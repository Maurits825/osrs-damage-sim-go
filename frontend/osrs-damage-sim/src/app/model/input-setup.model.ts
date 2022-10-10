export interface InputSetup {
    npc: number,
    gearInputSetups: GearInputSetup[][],
}

export interface GearInputSetup {
    name: string,
    gear: number[],
    attackStyle: string,
    attackCount: number,
    isSpecial: boolean,
    prayers: string[],
    combatStats: Map<string, number>,
    boosts: string[],
}
