import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DpsGraphTabsComponent } from './dps-graph-tabs.component';

describe('DpsGraphTabsComponent', () => {
  let component: DpsGraphTabsComponent;
  let fixture: ComponentFixture<DpsGraphTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DpsGraphTabsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DpsGraphTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
