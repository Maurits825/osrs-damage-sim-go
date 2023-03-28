import { Injectable } from '@angular/core';
import { GearSlot } from '../model/osrs/gear-slot.enum';
import { Item } from '../model/osrs/item.model';
import { DamageSimService } from './damage-sim.service';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  allGearSlotItems: Record<GearSlot, Item[]>;

  constructor(private damageSimservice: DamageSimService) {
    this.damageSimservice.allGearSlotItems$.subscribe((allGearSlotItems: Record<GearSlot, Item[]>) => {
      this.allGearSlotItems = allGearSlotItems;
    });
  }

  public getItem(slot: GearSlot, itemId: number): Item {
    return this.allGearSlotItems[slot].find((item: Item) => item.id === itemId);
  }
}
