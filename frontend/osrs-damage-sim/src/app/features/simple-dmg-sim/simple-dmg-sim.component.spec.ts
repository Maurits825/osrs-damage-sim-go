import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleDmgSimComponent } from './simple-dmg-sim.component';

describe('SimpleDmgSimComponent', () => {
  let component: SimpleDmgSimComponent;
  let fixture: ComponentFixture<SimpleDmgSimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleDmgSimComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimpleDmgSimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
