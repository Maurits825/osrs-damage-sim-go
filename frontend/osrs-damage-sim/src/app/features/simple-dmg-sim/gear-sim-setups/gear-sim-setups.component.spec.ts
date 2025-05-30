import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GearSimSetupsComponent } from './gear-sim-setups.component';
import { provideHttpClient } from '@angular/common/http';

describe('GearSimSetupComponent', () => {
  let component: GearSimSetupsComponent;
  let fixture: ComponentFixture<GearSimSetupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GearSimSetupsComponent],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(GearSimSetupsComponent);
    component = fixture.componentInstance;
    component.gearSimSetups = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
