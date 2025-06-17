import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickGearSelectComponent } from './quick-gear-select.component';
import { provideHttpClient } from '@angular/common/http';

import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('QuickGearSelectComponent', () => {
  let component: QuickGearSelectComponent;
  let fixture: ComponentFixture<QuickGearSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuickGearSelectComponent],
      providers: [provideHttpClient()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(QuickGearSelectComponent);
    component = fixture.componentInstance;

    component.items = [];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
