import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GearSetSelectComponent } from './gear-set-select.component';

describe('GearSetSelectComponent', () => {
  let component: GearSetSelectComponent;
  let fixture: ComponentFixture<GearSetSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GearSetSelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GearSetSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
