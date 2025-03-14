import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DpsTableComponent } from './dps-table.component';

describe('DpsTableComponent', () => {
  let component: DpsTableComponent;
  let fixture: ComponentFixture<DpsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DpsTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DpsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
