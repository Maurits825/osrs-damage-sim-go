import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiNpcInputComponent } from './multi-npc-input.component';

describe('MultiNpcInputComponent', () => {
  let component: MultiNpcInputComponent;
  let fixture: ComponentFixture<MultiNpcInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiNpcInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiNpcInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
