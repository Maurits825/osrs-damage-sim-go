import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickGearSelectComponent } from './quick-gear-select.component';
import { provideHttpClient } from '@angular/common/http';
import { GearSlot } from 'src/app/model/osrs/gear-slot.enum';

describe('QuickGearSelectComponent', () => {
  let component: QuickGearSelectComponent;
  let fixture: ComponentFixture<QuickGearSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuickGearSelectComponent],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(QuickGearSelectComponent);
    component = fixture.componentInstance;

    component.gearSlot = GearSlot.Weapon;
    component.attackType = 'melee';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
