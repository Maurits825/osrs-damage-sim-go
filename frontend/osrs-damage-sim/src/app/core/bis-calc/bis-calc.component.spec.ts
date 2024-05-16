import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BisCalcComponent } from './bis-calc.component';

describe('BisCalcComponent', () => {
  let component: BisCalcComponent;
  let fixture: ComponentFixture<BisCalcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BisCalcComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BisCalcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
