import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighscoreLookupComponent } from './highscore-lookup.component';
import { provideHttpClient } from '@angular/common/http';

import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('HighscoreLookupComponent', () => {
  let component: HighscoreLookupComponent;
  let fixture: ComponentFixture<HighscoreLookupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HighscoreLookupComponent],
      providers: [provideHttpClient()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(HighscoreLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
