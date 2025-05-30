import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DpsCalcComponent } from './dps-calc.component';
import { provideHttpClient } from '@angular/common/http';

describe('DpsCalcComponent', () => {
  let component: DpsCalcComponent;
  let fixture: ComponentFixture<DpsCalcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DpsCalcComponent],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(DpsCalcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
