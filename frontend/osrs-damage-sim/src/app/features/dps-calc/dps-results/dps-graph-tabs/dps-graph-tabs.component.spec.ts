import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DpsGraphTabsComponent } from './dps-graph-tabs.component';
import { provideHttpClient } from '@angular/common/http';

describe('DpsGraphTabsComponent', () => {
  let component: DpsGraphTabsComponent;
  let fixture: ComponentFixture<DpsGraphTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DpsGraphTabsComponent],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(DpsGraphTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
