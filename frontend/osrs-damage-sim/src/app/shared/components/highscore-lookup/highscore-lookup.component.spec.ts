import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighscoreLookupComponent } from './highscore-lookup.component';

describe('HighscoreLookupComponent', () => {
  let component: HighscoreLookupComponent;
  let fixture: ComponentFixture<HighscoreLookupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HighscoreLookupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HighscoreLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
