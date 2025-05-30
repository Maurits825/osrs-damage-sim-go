import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalcDetailsComponent } from './calc-details.component';
import { dpsCalcResultsMock } from '../dps-results.mock.spec';

describe('CalcDetailsComponent', () => {
  let component: CalcDetailsComponent;
  let fixture: ComponentFixture<CalcDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CalcDetailsComponent],
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
