import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoostItemComponent } from './boost-item.component';

describe('BoostItemComponent', () => {
  let component: BoostItemComponent;
  let fixture: ComponentFixture<BoostItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoostItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoostItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
