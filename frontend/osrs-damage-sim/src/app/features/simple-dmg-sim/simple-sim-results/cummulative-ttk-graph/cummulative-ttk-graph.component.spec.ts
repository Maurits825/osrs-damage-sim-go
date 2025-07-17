import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CummulativeTtkGraphComponent } from './cummulative-ttk-graph.component';
import { TickToTimePipe } from 'src/app/shared/pipes/tick-to-time.pipe';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CummulativeTtkGraphComponent', () => {
  let component: CummulativeTtkGraphComponent;
  let fixture: ComponentFixture<CummulativeTtkGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CummulativeTtkGraphComponent],
      providers: [TickToTimePipe],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CummulativeTtkGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
