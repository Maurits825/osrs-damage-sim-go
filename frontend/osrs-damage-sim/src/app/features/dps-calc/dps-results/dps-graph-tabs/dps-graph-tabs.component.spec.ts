import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DpsGraphTabsComponent } from './dps-graph-tabs.component';
import { provideHttpClient } from '@angular/common/http';

import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DpsGraphTabsComponent', () => {
  let component: DpsGraphTabsComponent;
  let fixture: ComponentFixture<DpsGraphTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DpsGraphTabsComponent],
      providers: [provideHttpClient()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DpsGraphTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
