import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedRunResultsComponent } from './detailed-run-results.component';
import { provideHttpClient } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DetailedRunResultsComponent', () => {
  let component: DetailedRunResultsComponent;
  let fixture: ComponentFixture<DetailedRunResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailedRunResultsComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailedRunResultsComponent);
    component = fixture.componentInstance;

    component.results = [
      {
        averageTtk: 0,
        maxTtk: 0,
        minTtk: 0,
        ttkHistogram: [],
        cummulativeTtk: [],
        detailedRuns: [
          {
            ttk: 0,
            tickData: [],
          },
        ],
      },
    ];
    component.selectedResult = component.results[0];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
