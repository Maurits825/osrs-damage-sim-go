import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HitDistGraphComponent } from './hit-dist-graph.component';

describe('HitDistGraphComponent', () => {
  let component: HitDistGraphComponent;
  let fixture: ComponentFixture<HitDistGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HitDistGraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HitDistGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
