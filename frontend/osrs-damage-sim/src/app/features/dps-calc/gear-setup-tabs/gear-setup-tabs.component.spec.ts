import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GearSetupTabsComponent } from './gear-setup-tabs.component';
import { provideHttpClient } from '@angular/common/http';

import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('GearSetupTabsComponent', () => {
  let component: GearSetupTabsComponent;
  let fixture: ComponentFixture<GearSetupTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GearSetupTabsComponent],
      providers: [provideHttpClient()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(GearSetupTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
