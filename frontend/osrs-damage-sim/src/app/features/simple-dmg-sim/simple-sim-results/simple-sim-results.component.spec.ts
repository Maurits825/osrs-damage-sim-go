import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleSimResultsComponent } from './simple-sim-results.component';
import { provideHttpClient } from '@angular/common/http';

describe('SimpleSimResultsComponent', () => {
  let component: SimpleSimResultsComponent;
  let fixture: ComponentFixture<SimpleSimResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SimpleSimResultsComponent],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(SimpleSimResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
