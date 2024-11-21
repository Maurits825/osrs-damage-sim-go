import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WikiDpsShortlinkComponent } from './wiki-dps-shortlink.component';

describe('WikiDpsShortlinkComponent', () => {
  let component: WikiDpsShortlinkComponent;
  let fixture: ComponentFixture<WikiDpsShortlinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WikiDpsShortlinkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WikiDpsShortlinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
