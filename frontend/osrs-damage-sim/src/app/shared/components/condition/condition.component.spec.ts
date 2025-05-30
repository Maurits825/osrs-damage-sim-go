import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConditionComponent } from './condition.component';

import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ConditionComponent', () => {
  let component: ConditionComponent;
  let fixture: ComponentFixture<ConditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConditionComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
