import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareInputSetupModalComponent } from './share-input-setup-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

describe('ShareInputSetupModalComponent', () => {
  let component: ShareInputSetupModalComponent;
  let fixture: ComponentFixture<ShareInputSetupModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [NgbActiveModal],
      declarations: [ShareInputSetupModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ShareInputSetupModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
