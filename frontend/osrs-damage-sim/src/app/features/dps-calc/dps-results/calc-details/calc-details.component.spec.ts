import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalcDetailsComponent } from './calc-details.component';
import { dpsCalcResultsMock } from '../dps-results.mock.spec';

import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CalcDetailsComponent', () => {
  let component: CalcDetailsComponent;
  let fixture: ComponentFixture<CalcDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CalcDetailsComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CalcDetailsComponent);
    component = fixture.componentInstance;
    component.dpsCalcResults = dpsCalcResultsMock;
    component.selectedDpsCalcResult = dpsCalcResultsMock.results[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
