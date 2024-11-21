import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GearSetupLabelComponent } from './gear-setup-label.component';

describe('GearSetupLabelComponent', () => {
  let component: GearSetupLabelComponent;
  let fixture: ComponentFixture<GearSetupLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GearSetupLabelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GearSetupLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
