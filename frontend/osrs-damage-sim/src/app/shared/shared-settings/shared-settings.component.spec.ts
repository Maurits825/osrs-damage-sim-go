import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedSettingsComponent } from './shared-settings.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SharedSettingsComponent', () => {
  let component: SharedSettingsComponent;
  let fixture: ComponentFixture<SharedSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SharedSettingsComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
