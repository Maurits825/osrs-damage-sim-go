import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrayerSelectionComponent } from './prayer-selection.component';
import { Prayer } from 'src/app/model/osrs/prayer.model';

import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('PrayerSelectionComponent', () => {
  let component: PrayerSelectionComponent;
  let fixture: ComponentFixture<PrayerSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrayerSelectionComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(PrayerSelectionComponent);
    component = fixture.componentInstance;
    component.selectedPrayers = new Set<Prayer>();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
