import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttackCycleComponent } from './attack-cycle.component';

describe('AttackCycleComponent', () => {
  let component: AttackCycleComponent;
  let fixture: ComponentFixture<AttackCycleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttackCycleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttackCycleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
