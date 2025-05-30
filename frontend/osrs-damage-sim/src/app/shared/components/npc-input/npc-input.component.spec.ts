import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NpcInputComponent } from './npc-input.component';
import { provideHttpClient } from '@angular/common/http';

import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('NpcInputComponent', () => {
  let component: NpcInputComponent;
  let fixture: ComponentFixture<NpcInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NpcInputComponent],
      providers: [provideHttpClient()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(NpcInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
