import { Item } from "./item";

export interface GearSlotItems {
    [key: string]: Item[]
}

export interface GearSlotItem {
    [key: string]: Item
}
