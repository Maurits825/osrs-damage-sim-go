import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangelogModalComponent } from './changelog-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ChangelogComponent', () => {
  let component: ChangelogModalComponent;
  let fixture: ComponentFixture<ChangelogModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [NgbActiveModal],
      declarations: [ChangelogModalComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangelogModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
