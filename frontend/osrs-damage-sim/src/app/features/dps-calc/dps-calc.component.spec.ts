import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DpsCalcComponent } from './dps-calc.component';
import { provideHttpClient } from '@angular/common/http';

import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DpsCalcComponent', () => {
  let component: DpsCalcComponent;
  let fixture: ComponentFixture<DpsCalcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DpsCalcComponent],
      providers: [provideHttpClient()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DpsCalcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
