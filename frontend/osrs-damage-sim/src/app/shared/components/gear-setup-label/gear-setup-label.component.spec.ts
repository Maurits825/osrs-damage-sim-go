import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GearSetupLabelComponent } from './gear-setup-label.component';
import { DEFAULT_GEAR_SETUP } from 'src/app/model/shared/gear-setup.model';

describe('GearSetupLabelComponent', () => {
  let component: GearSetupLabelComponent;
  let fixture: ComponentFixture<GearSetupLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GearSetupLabelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GearSetupLabelComponent);
    component = fixture.componentInstance;
    component.gearSetup = DEFAULT_GEAR_SETUP;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
