import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BisCalcComponent } from './bis-calc.component';
import { provideHttpClient } from '@angular/common/http';

import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('BisCalcComponent', () => {
  let component: BisCalcComponent;
  let fixture: ComponentFixture<BisCalcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BisCalcComponent],
      providers: [provideHttpClient()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(BisCalcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
