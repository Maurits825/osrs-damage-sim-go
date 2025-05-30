import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalSettingsComponent } from './global-settings.component';
import { provideHttpClient } from '@angular/common/http';

describe('GlobalSettingsComponent', () => {
  let component: GlobalSettingsComponent;
  let fixture: ComponentFixture<GlobalSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GlobalSettingsComponent],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(GlobalSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
