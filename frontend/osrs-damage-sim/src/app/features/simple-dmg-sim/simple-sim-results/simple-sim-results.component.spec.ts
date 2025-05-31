import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleSimResultsComponent } from './simple-sim-results.component';

describe('SimpleSimResultsComponent', () => {
  let component: SimpleSimResultsComponent;
  let fixture: ComponentFixture<SimpleSimResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SimpleSimResultsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SimpleSimResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
