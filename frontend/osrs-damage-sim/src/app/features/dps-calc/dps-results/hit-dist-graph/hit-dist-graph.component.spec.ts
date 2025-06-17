import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HitDistGraphComponent } from './hit-dist-graph.component';
import { dpsCalcResultsMock } from '../dps-results.mock.spec';

import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('HitDistGraphComponent', () => {
  let component: HitDistGraphComponent;
  let fixture: ComponentFixture<HitDistGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HitDistGraphComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(HitDistGraphComponent);
    component = fixture.componentInstance;
    component.dpsCalcResults = dpsCalcResultsMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
