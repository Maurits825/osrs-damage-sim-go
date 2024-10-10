import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DpsResultsComponent } from './dps-results.component';

describe('DpsResultsComponent', () => {
  let component: DpsResultsComponent;
  let fixture: ComponentFixture<DpsResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DpsResultsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DpsResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
