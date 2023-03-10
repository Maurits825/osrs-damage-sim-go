import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgSelectLazyLoadComponent } from './ng-select-lazy-load.component';

describe('NgSelectLazyLoadComponent', () => {
  let component: NgSelectLazyLoadComponent<string>;
  let fixture: ComponentFixture<NgSelectLazyLoadComponent<string>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NgSelectLazyLoadComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NgSelectLazyLoadComponent<string>);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
