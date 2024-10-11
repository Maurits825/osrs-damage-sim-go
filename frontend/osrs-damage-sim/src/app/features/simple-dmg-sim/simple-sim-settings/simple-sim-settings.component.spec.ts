import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleSimSettingsComponent } from './simple-sim-settings.component';

describe('SimpleSimSettingsComponent', () => {
  let component: SimpleSimSettingsComponent;
  let fixture: ComponentFixture<SimpleSimSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleSimSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimpleSimSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
