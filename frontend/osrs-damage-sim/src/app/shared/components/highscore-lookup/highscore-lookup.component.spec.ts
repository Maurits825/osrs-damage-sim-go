import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighscoreLookupComponent } from './highscore-lookup.component';
import { provideHttpClient } from '@angular/common/http';

describe('HighscoreLookupComponent', () => {
  let component: HighscoreLookupComponent;
  let fixture: ComponentFixture<HighscoreLookupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HighscoreLookupComponent],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(HighscoreLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
