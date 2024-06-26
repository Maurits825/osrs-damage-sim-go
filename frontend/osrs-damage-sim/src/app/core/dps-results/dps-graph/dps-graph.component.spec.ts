import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DpsGraphComponent } from './dps-graph.component';

describe('DpsGraphComponent', () => {
  let component: DpsGraphComponent;
  let fixture: ComponentFixture<DpsGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DpsGraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DpsGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
