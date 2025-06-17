import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareInputSetupModalComponent } from './share-input-setup-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ShareInputSetupModalComponent', () => {
  let component: ShareInputSetupModalComponent;
  let fixture: ComponentFixture<ShareInputSetupModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [NgbActiveModal],
      declarations: [ShareInputSetupModalComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ShareInputSetupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
