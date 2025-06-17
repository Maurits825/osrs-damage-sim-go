import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttackCycleComponent } from './attack-cycle.component';

import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AttackCycleComponent', () => {
  let component: AttackCycleComponent;
  let fixture: ComponentFixture<AttackCycleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AttackCycleComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AttackCycleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
