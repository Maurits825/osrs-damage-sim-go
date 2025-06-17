import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgSelectLazyLoadComponent } from './ng-select-lazy-load.component';
import { provideHttpClient } from '@angular/common/http';

import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('NgSelectLazyLoadComponent', () => {
  let component: NgSelectLazyLoadComponent<string>;
  let fixture: ComponentFixture<NgSelectLazyLoadComponent<string>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NgSelectLazyLoadComponent],
      providers: [provideHttpClient()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(NgSelectLazyLoadComponent<string>);
    component = fixture.componentInstance;

    component.valueType = 'string';
    component.allValues = ['Item 1', 'Item 2', 'Item 3'];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
