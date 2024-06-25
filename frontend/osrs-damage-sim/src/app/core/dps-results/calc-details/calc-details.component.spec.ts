import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalcDetailsComponent } from './calc-details.component';

describe('CalcDetailsComponent', () => {
  let component: CalcDetailsComponent;
  let fixture: ComponentFixture<CalcDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalcDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalcDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
