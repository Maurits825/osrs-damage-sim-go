import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedSettingsComponent } from './shared-settings.component';

describe('SharedSettingsComponent', () => {
  let component: SharedSettingsComponent;
  let fixture: ComponentFixture<SharedSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
