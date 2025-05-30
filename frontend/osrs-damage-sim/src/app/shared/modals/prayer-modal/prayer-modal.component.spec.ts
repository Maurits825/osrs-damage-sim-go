import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrayerModalComponent } from './prayer-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Prayer } from 'src/app/model/osrs/prayer.model';

describe('PrayerModalComponent', () => {
  let component: PrayerModalComponent;
  let fixture: ComponentFixture<PrayerModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [NgbActiveModal],
      declarations: [PrayerModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PrayerModalComponent);
    component = fixture.componentInstance;
    component.selectedPrayers = new Set<Prayer>();
    component.disabledPrayers = new Set<Prayer>();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
