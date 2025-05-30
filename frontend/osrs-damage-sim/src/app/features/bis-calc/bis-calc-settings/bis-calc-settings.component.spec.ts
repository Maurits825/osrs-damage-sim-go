import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BisCalcSettingsComponent } from './bis-calc-settings.component';

import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('BisCalcSettingsComponent', () => {
  let component: BisCalcSettingsComponent;
  let fixture: ComponentFixture<BisCalcSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BisCalcSettingsComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(BisCalcSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
