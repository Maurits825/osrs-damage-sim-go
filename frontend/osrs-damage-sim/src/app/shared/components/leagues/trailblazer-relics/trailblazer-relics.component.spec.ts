import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailblazerRelicsComponent } from './trailblazer-relics.component';

import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('TrailblazerRelicsComponent', () => {
  let component: TrailblazerRelicsComponent;
  let fixture: ComponentFixture<TrailblazerRelicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TrailblazerRelicsComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TrailblazerRelicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
