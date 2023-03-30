import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedRunResultsComponent } from './detailed-run-results.component';

describe('DetailedRunResultsComponent', () => {
  let component: DetailedRunResultsComponent;
  let fixture: ComponentFixture<DetailedRunResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailedRunResultsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailedRunResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
