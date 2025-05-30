import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatDrainSelectionComponent } from './stat-drain-selection.component';

import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('StatDrainSelectionComponent', () => {
  let component: StatDrainSelectionComponent;
  let fixture: ComponentFixture<StatDrainSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatDrainSelectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StatDrainSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
