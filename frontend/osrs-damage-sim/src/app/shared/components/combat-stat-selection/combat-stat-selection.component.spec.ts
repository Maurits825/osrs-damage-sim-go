import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CombatStatSelectionComponent } from './combat-stat-selection.component';
import { DEFAULT_COMBAT_STATS } from 'src/app/model/osrs/skill.type';

describe('CombatStatSelectionComponent', () => {
  let component: CombatStatSelectionComponent;
  let fixture: ComponentFixture<CombatStatSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CombatStatSelectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CombatStatSelectionComponent);
    component = fixture.componentInstance;
    component.combatStats = DEFAULT_COMBAT_STATS;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
