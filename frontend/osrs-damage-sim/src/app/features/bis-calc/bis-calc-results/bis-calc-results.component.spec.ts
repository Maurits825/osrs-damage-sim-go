import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BisCalcResultsComponent } from './bis-calc-results.component';

describe('BisCalcResultsComponent', () => {
  let component: BisCalcResultsComponent;
  let fixture: ComponentFixture<BisCalcResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BisCalcResultsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BisCalcResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
