export interface DamageSimResults {
    setupTtkStats: SimStats[],
}

export interface SimStats {
    average: string
    maximum: string
    minimum: string
    most_frequent: string
    
    chance_to_kill: string[]
    
    label: string
}
