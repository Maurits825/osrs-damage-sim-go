import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleSimSettingsComponent } from './simple-sim-settings.component';
import { provideHttpClient } from '@angular/common/http';

import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SimpleSimSettingsComponent', () => {
  let component: SimpleSimSettingsComponent;
  let fixture: ComponentFixture<SimpleSimSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SimpleSimSettingsComponent],
      providers: [provideHttpClient()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SimpleSimSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
