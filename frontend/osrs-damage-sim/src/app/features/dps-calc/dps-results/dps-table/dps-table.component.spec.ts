import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DpsTableComponent } from './dps-table.component';

import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DpsTableComponent', () => {
  let component: DpsTableComponent;
  let fixture: ComponentFixture<DpsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DpsTableComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DpsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
