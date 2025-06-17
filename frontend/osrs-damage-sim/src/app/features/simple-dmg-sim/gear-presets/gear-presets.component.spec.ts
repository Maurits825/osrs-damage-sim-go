import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GearPresetsComponent } from './gear-presets.component';
import { provideHttpClient } from '@angular/common/http';

import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('GearPresetsComponent', () => {
  let component: GearPresetsComponent;
  let fixture: ComponentFixture<GearPresetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GearPresetsComponent],
      providers: [provideHttpClient()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(GearPresetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
