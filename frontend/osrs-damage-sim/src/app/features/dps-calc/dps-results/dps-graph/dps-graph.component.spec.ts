import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DpsGraphComponent } from './dps-graph.component';
import { dpsGrapherResultsMock } from '../dps-results.mock.spec';

import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DpsGraphComponent', () => {
  let component: DpsGraphComponent;
  let fixture: ComponentFixture<DpsGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DpsGraphComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DpsGraphComponent);
    component = fixture.componentInstance;
    component.dpsGrapherResults = dpsGrapherResultsMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
