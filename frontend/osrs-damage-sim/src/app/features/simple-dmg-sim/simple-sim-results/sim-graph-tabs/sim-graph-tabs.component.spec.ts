import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimGraphTabsComponent } from './sim-graph-tabs.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SimGraphTabsComponent', () => {
  let component: SimGraphTabsComponent;
  let fixture: ComponentFixture<SimGraphTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SimGraphTabsComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SimGraphTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
