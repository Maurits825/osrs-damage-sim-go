import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DpsCalcComponent } from './dps-calc.component';

describe('DpsCalcComponent', () => {
  let component: DpsCalcComponent;
  let fixture: ComponentFixture<DpsCalcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DpsCalcComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DpsCalcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
