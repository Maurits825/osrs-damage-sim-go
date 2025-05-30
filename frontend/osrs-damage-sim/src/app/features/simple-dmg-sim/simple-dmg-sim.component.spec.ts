import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleDmgSimComponent } from './simple-dmg-sim.component';
import { provideHttpClient } from '@angular/common/http';

import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SimpleDmgSimComponent', () => {
  let component: SimpleDmgSimComponent;
  let fixture: ComponentFixture<SimpleDmgSimComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SimpleDmgSimComponent],
      providers: [provideHttpClient()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SimpleDmgSimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
