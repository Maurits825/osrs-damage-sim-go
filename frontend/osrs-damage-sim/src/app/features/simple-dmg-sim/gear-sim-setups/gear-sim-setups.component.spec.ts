import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GearSimSetupsComponent } from './gear-sim-setups.component';
import { provideHttpClient } from '@angular/common/http';

import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('GearSimSetupComponent', () => {
  let component: GearSimSetupsComponent;
  let fixture: ComponentFixture<GearSimSetupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GearSimSetupsComponent],
      providers: [provideHttpClient()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(GearSimSetupsComponent);
    component = fixture.componentInstance;

    component.mainGearSimSetup = {
      gearPresetIndex: 0,
      conditions: [],
    };
    component.gearSimSetups = [];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
