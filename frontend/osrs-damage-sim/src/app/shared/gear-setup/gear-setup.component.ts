import { Component, OnDestroy, OnInit, Optional, SkipSelf, ViewChild } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { forkJoin, Subscription } from 'rxjs';
import { skip } from 'rxjs/operators';
import { ConditionComponent } from '../condition/condition.component';
import { AUTOCAST_STLYE } from '../../constants.const';
import { GearSetupTabComponent } from '../gear-setup-tab/gear-setup-tab.component';
import { allBoosts, Boost } from '../../model/osrs/boost.model';
import { Condition } from '../../model/damage-sim/condition.model';
import { GearSlot } from '../../model/osrs/gear-slot.enum';
import { GearSetup } from '../../model/damage-sim/input-setup.model';
import { AttackType, Item } from '../../model/osrs/item.model';
import { CombatStats } from '../../model/osrs/skill.type';
import { SpecialGear } from '../../model/damage-sim/special-gear.model';
import { DamageSimService } from '../../services/damage-sim.service';
import { BoostService } from '../../services/boost.service';
import { RlGearService } from '../../services/rl-gear.service';
import { DRAGON_DARTS_ID, UNARMED_EQUIVALENT_ID, DEFAULT_GEAR_SETUP } from './gear-setup.const';
import { Prayer } from 'src/app/model/osrs/prayer.model';
import { PrayerService } from 'src/app/services/prayer.service';
import { CombatStatService } from 'src/app/services/combat-stat.service';
import { SpecialGearService } from 'src/app/services/special-gear.service';

@Component({
  selector: 'app-gear-setup.col-md-6',
  templateUrl: './gear-setup.component.html',
  styleUrls: ['./gear-setup.component.css'],
})
export class GearSetupComponent implements OnInit, OnDestroy {
  @ViewChild(ConditionComponent) conditionComponent: ConditionComponent;

  setupCount: number;
  gearSetupTabRef: GearSetupTabComponent;

  GearSlot = GearSlot;

  gearSetup: GearSetup;

  allGearSlots: GearSlot[] = Object.values(GearSlot);

  allGearSlotItems: Record<GearSlot, Item[]>;

  gearSetupPresets: Record<string, Record<GearSlot, number>> = {};
  selectedGearSetupPreset: string = '';

  allBoosts = allBoosts;

  attackStyles: string[];
  allSpells: string[];

  allDarts: Item[];

  specialGear: SpecialGear = {
    isSpecialWeapon: false,
    isSlayerHelm: false,
    isWildernessWeapon: false,
    isDharokSet: false,
    isSpecialBolt: false,
    isBlowpipe: false,
    isPickaxe: false,
  };

  private subscriptions: Subscription = new Subscription();

  constructor(
    private damageSimservice: DamageSimService,
    private rlGearService: RlGearService,
    private boostService: BoostService,
    private prayerService: PrayerService,
    private combatStatService: CombatStatService,
    private specialGearService: SpecialGearService,
    @SkipSelf() @Optional() private gearSetupToCopy: GearSetupComponent
  ) {}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngOnInit(): void {
    forkJoin({
      allGearSlotItems: this.damageSimservice.allGearSlotItems$,
      gearSetupPresets: this.damageSimservice.gearSetupPresets$,
      allSpells: this.damageSimservice.allSpells$,
      allDarts: this.damageSimservice.allDarts$,
    }).subscribe(({ allGearSlotItems, gearSetupPresets, allSpells, allDarts }) => {
      this.allGearSlotItems = allGearSlotItems;
      this.gearSetupPresets = gearSetupPresets;
      this.allSpells = allSpells;
      this.allDarts = allDarts;

      if (this.gearSetupToCopy) {
        this.setGearSetup(this.gearSetupToCopy);
      } else {
        this.gearSetup = cloneDeep(DEFAULT_GEAR_SETUP);

        this.gearSetup.blowpipeDarts = this.allDarts.find((dart: Item) => dart.id === DRAGON_DARTS_ID);

        this.gearSetup.prayers = new Set(this.prayerService.globalPrayers$.getValue()['melee']);
        this.attackStyles = this.getItem(GearSlot.Weapon, UNARMED_EQUIVALENT_ID).attackStyles;
      }

      this.subscriptions.add(
        this.prayerService.globalPrayers$
          .pipe(skip(1))
          .subscribe(
            (prayers: Record<AttackType, Set<Prayer>>) =>
              (this.gearSetup.prayers = new Set(prayers[this.gearSetup.gear[GearSlot.Weapon]?.attackType || 'melee']))
          )
      );

      this.subscriptions.add(
        this.combatStatService.globalCombatStats$
          .pipe(skip(1))
          .subscribe((combatStats: CombatStats) => (this.gearSetup.combatStats = { ...combatStats }))
      );
    });
  }

  getItem(slot: GearSlot, id: number): Item {
    return this.allGearSlotItems[slot].find((item: Item) => item.id === id);
  }

  getGearSetup(): GearSetup {
    return this.gearSetup;
  }

  //TODO fix
  loadRlGear(): void {
    // this.selectedGearSetup = null;
    // this.rlGearService.getGear().subscribe((gearSetup: Record<number, Item>) => {
    //   this.set__CurrentGear(gearSetup);
    //   if (gearSetup[this.weaponSlot]?.name) {
    //     this.setupName = gearSetup[this.weaponSlot].name;
    //   }
    // });
  }

  loadGearSetup(setupName: string) {
    const gearIds = this.gearSetupPresets[setupName];
    this.setCurrentGearById(gearIds);
    this.gearSetup.setupName = setupName;
    this.selectedGearSetupPreset = setupName;
  }

  setCurrentGearById(gearIds: Record<GearSlot, number>): void {
    this.allGearSlots.forEach((slot: GearSlot) => {
      if (gearIds[slot]) {
        const item = this.getItem(slot, gearIds[slot]);
        this.gearSlotChange(item, slot);
        this.gearSetup.gear[slot] = item;
      } else {
        this.gearSlotChange(null, slot);
        this.gearSetup.gear[slot] = null;
      }
    });
  }

  gearSlotChange(item: Item, slot: GearSlot): void {
    this.selectedGearSetupPreset = null;

    if (slot === GearSlot.Weapon) {
      let itemId = UNARMED_EQUIVALENT_ID;
      this.gearSetup.setupName = 'Unarmed';
      let attackType: AttackType = 'melee';
      if (item) {
        itemId = item.id;
        this.gearSetup.setupName = item.name;
        attackType = item.attackType;
      }

      this.gearSetup.prayers = new Set(this.prayerService.globalPrayers$.getValue()[attackType]);

      this.updateAttackStyle(itemId);
    }

    this.updateSpecialGear();
  }

  updateAttackStyle(itemId: number): void {
    this.attackStyles = this.getItem(GearSlot.Weapon, itemId).attackStyles;
    if (this.attackStyles.includes(AUTOCAST_STLYE)) {
      this.gearSetup.attackStyle = AUTOCAST_STLYE;
    } else {
      this.gearSetup.attackStyle = this.attackStyles[1]; //second attack style is most commonly used
    }
  }

  togglePrayer(prayer: Prayer): void {
    this.prayerService.togglePrayer(prayer, this.gearSetup.prayers);
  }

  combatStatsChanged(combatStats: CombatStats): void {
    this.gearSetup.combatStats = { ...combatStats };
  }

  removeGearSetup(): void {
    this.gearSetupTabRef.removeGearSetup(this.setupCount);
  }

  setGearSetup(gearSetupComponent: GearSetupComponent): void {
    this.gearSetup = cloneDeep(gearSetupComponent.gearSetup);

    this.selectedGearSetupPreset = gearSetupComponent.selectedGearSetupPreset;
    this.attackStyles = [...gearSetupComponent.attackStyles];
    this.specialGear = { ...gearSetupComponent.specialGear };
  }

  updateConditions(conditions: Condition[]): void {
    this.gearSetup.conditions = conditions;
  }

  duplicateGearSetup(): void {
    this.gearSetupTabRef.addNewGearSetup(this);
  }

  updateSpecialGear(): void {
    this.specialGear = this.specialGearService.getSpecialGear(this.gearSetup);
  }

  useSpecialAttackChange(): void {
    if (this.gearSetup.isSpecial) {
      this.gearSetup.isFill = true;
    }
  }

  selectedSpellChange(): void {
    if (this.attackStyles.includes(AUTOCAST_STLYE)) {
      this.gearSetup.attackStyle = AUTOCAST_STLYE;
    } else {
      this.gearSetup.attackStyle = null;
    }
  }
}
