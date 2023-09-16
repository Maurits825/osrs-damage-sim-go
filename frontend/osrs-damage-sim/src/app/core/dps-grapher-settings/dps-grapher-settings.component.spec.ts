import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DpsGrapherSettingsComponent } from './dps-grapher-settings.component';

describe('DpsGrapherSettingsComponent', () => {
  let component: DpsGrapherSettingsComponent;
  let fixture: ComponentFixture<DpsGrapherSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DpsGrapherSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DpsGrapherSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
