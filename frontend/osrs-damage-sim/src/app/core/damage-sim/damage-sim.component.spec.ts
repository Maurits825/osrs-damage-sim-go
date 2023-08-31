import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DamageSimComponent } from './damage-sim.component';

describe('DamageSimComponent', () => {
  let component: DamageSimComponent;
  let fixture: ComponentFixture<DamageSimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DamageSimComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DamageSimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
