import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BisCalcResultsComponent } from './bis-calc-results.component';
import { provideHttpClient } from '@angular/common/http';

import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('BisCalcResultsComponent', () => {
  let component: BisCalcResultsComponent;
  let fixture: ComponentFixture<BisCalcResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BisCalcResultsComponent],
      providers: [provideHttpClient()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(BisCalcResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
