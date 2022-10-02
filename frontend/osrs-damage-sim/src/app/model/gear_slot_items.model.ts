import { Item } from "./item.model";

export interface GearSlotItems {
    [key: string]: Item[]
}

export interface GearSlotItem {
    [key: number]: Item
}

export interface GearSetup {
    [key: string]: GearSlotItem
}
