import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputSetupLabelComponent } from './input-setup-label.component';

import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('GearSetupImgLabelComponent', () => {
  let component: InputSetupLabelComponent;
  let fixture: ComponentFixture<InputSetupLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputSetupLabelComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(InputSetupLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
