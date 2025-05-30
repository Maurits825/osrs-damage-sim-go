import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DpsResultsComponent } from './dps-results.component';
import { provideHttpClient } from '@angular/common/http';

import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DpsResultsComponent', () => {
  let component: DpsResultsComponent;
  let fixture: ComponentFixture<DpsResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DpsResultsComponent],
      providers: [provideHttpClient()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DpsResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
