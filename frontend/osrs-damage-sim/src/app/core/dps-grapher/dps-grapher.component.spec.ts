import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DpsGrapherComponent } from './dps-grapher.component';

describe('DpsGrapherComponent', () => {
  let component: DpsGrapherComponent;
  let fixture: ComponentFixture<DpsGrapherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DpsGrapherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DpsGrapherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
