import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GearSetupSettingsComponent } from './gear-setup-settings.component';

import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('GearSetupSettingsComponent', () => {
  let component: GearSetupSettingsComponent;
  let fixture: ComponentFixture<GearSetupSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GearSetupSettingsComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(GearSetupSettingsComponent);
    component = fixture.componentInstance;
    component.gearSetupSettings = null;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
