import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExampleSetupsComponent } from './example-setups.component';
import { provideHttpClient } from '@angular/common/http';

import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ExampleSetupsComponent', () => {
  let component: ExampleSetupsComponent;
  let fixture: ComponentFixture<ExampleSetupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExampleSetupsComponent],
      providers: [provideHttpClient()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ExampleSetupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
