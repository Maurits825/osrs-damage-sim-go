import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitTestModalComponent } from './unit-test-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { provideHttpClient } from '@angular/common/http';

describe('UnitTestModalComponent', () => {
  let component: UnitTestModalComponent;
  let fixture: ComponentFixture<UnitTestModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [NgbActiveModal, provideHttpClient()],
      declarations: [UnitTestModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UnitTestModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
