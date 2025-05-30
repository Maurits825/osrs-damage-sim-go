import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WikiDpsShortlinkComponent } from './wiki-dps-shortlink.component';
import { provideHttpClient } from '@angular/common/http';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('WikiDpsShortlinkComponent', () => {
  let component: WikiDpsShortlinkComponent;
  let fixture: ComponentFixture<WikiDpsShortlinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgbPopoverModule],
      declarations: [WikiDpsShortlinkComponent],
      providers: [provideHttpClient()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(WikiDpsShortlinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
