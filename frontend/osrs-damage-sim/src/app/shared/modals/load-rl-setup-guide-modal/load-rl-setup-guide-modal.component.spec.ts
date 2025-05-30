import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadRlSetupGuideModalComponent } from './load-rl-setup-guide-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('LoadRlSetupGuideModalComponent', () => {
  let component: LoadRlSetupGuideModalComponent;
  let fixture: ComponentFixture<LoadRlSetupGuideModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [NgbActiveModal],
      declarations: [LoadRlSetupGuideModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoadRlSetupGuideModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
