import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitTestModalComponent } from './unit-test-modal.component';

describe('UnitTestModalComponent', () => {
  let component: UnitTestModalComponent;
  let fixture: ComponentFixture<UnitTestModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnitTestModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnitTestModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
