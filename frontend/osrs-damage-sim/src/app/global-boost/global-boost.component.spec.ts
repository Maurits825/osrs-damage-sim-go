import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalBoostComponent } from './global-boost.component';

describe('GlobalBoostComponent', () => {
  let component: GlobalBoostComponent;
  let fixture: ComponentFixture<GlobalBoostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GlobalBoostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GlobalBoostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
