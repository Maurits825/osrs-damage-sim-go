import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TtkHistogramGraphComponent } from './ttk-histogram-graph.component';
import { TickToTimePipe } from 'src/app/shared/pipes/tick-to-time.pipe';

describe('TtkHistogramGraphComponent', () => {
  let component: TtkHistogramGraphComponent;
  let fixture: ComponentFixture<TtkHistogramGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TtkHistogramGraphComponent],
      providers: [TickToTimePipe],
    }).compileComponents();

    fixture = TestBed.createComponent(TtkHistogramGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
