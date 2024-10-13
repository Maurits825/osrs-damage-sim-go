import { Injectable } from '@angular/core';
import { SpecialGear } from '../model/shared/special-gear.model';
import { GearSlot } from '../model/osrs/gear-slot.enum';
import { SPECIAL_BOLTS, BLOWPIPE_ID, WILDY_WEAPONS } from '../model/shared/gear-setup.model';
import { GearSetup } from '../model/shared/gear-setup.model';

@Injectable({
  providedIn: 'root',
})
export class SpecialGearService {
  getSpecialGear(gearInputSetup: GearSetup): SpecialGear {
    return {
      isSlayerHelm: this.getIsSlayerHelm(gearInputSetup),
      isWildernessWeapon: this.getIsWildernessWeapon(gearInputSetup),
      isSpecialBolt: this.getIsSpecialBolt(gearInputSetup),
      isDharokSet: this.getIsDharokSet(gearInputSetup),
      isSpecialWeapon: this.getIsSpecialWeapon(gearInputSetup),
      isBlowpipe: this.getIsBlowpipe(gearInputSetup),
      isPickaxe: this.getIsPickaxe(gearInputSetup),
    };
  }

  private getIsSlayerHelm(gearInputSetup: GearSetup): boolean {
    const itemName = gearInputSetup.gear[GearSlot.Head]?.name;
    if (!itemName) {
      return false;
    }

    const name = itemName.toLowerCase();
    return name.includes('slayer helmet') || name.includes('black mask');
  }

  private getIsWildernessWeapon(gearInputSetup: GearSetup): boolean {
    return WILDY_WEAPONS.some((weaponId: number) => gearInputSetup.gear[GearSlot.Weapon]?.id === weaponId);
  }

  private getIsDharokSet(gearInputSetup: GearSetup): boolean {
    return (
      gearInputSetup.gear[GearSlot.Head]?.id === 4716 &&
      gearInputSetup.gear[GearSlot.Weapon]?.id === 4718 &&
      gearInputSetup.gear[GearSlot.Body]?.id === 4720 &&
      gearInputSetup.gear[GearSlot.Legs]?.id === 4722
    );
  }

  private getIsSpecialBolt(gearInputSetup: GearSetup): boolean {
    return SPECIAL_BOLTS.some((boltId: number) => gearInputSetup.gear[GearSlot.Ammo]?.id === boltId);
  }

  private getIsSpecialWeapon(gearInputSetup: GearSetup): boolean {
    return !!gearInputSetup.gear[GearSlot.Weapon]?.specialAttackCost;
  }

  private getIsBlowpipe(gearInputSetup: GearSetup): boolean {
    return gearInputSetup.gear[GearSlot.Weapon]?.id === BLOWPIPE_ID;
  }

  private getIsPickaxe(gearInputSetup: GearSetup): boolean {
    return gearInputSetup.gear[GearSlot.Weapon]?.name.includes('pickaxe');
  }
}
