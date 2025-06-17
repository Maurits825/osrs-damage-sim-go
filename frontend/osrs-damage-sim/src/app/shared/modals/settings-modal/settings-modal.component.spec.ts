import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsModalComponent } from './settings-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SettingsModalComponent', () => {
  let component: SettingsModalComponent;
  let fixture: ComponentFixture<SettingsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [NgbActiveModal],
      declarations: [SettingsModalComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
