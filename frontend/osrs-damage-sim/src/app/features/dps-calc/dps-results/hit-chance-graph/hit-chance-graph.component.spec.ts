import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HitChanceGraphComponent } from './hit-chance-graph.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('HitChanceGraphComponent', () => {
  let component: HitChanceGraphComponent;
  let fixture: ComponentFixture<HitChanceGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HitChanceGraphComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(HitChanceGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
