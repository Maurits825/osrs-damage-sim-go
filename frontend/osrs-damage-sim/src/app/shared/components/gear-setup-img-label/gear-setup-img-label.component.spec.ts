import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GearSetupImgLabelComponent } from './gear-setup-img-label.component';

describe('GearSetupImgLabelComponent', () => {
  let component: GearSetupImgLabelComponent;
  let fixture: ComponentFixture<GearSetupImgLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GearSetupImgLabelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GearSetupImgLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
