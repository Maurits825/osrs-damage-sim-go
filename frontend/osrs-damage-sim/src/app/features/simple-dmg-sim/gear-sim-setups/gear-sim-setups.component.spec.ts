import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GearSimSetupsComponent } from './gear-sim-setups.component';

describe('GearSimSetupComponent', () => {
  let component: GearSimSetupsComponent;
  let fixture: ComponentFixture<GearSimSetupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GearSimSetupsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GearSimSetupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
