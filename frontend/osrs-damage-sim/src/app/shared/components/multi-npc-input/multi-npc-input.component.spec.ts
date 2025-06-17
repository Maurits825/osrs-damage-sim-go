import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiNpcInputComponent } from './multi-npc-input.component';
import { provideHttpClient } from '@angular/common/http';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ALL_MULTI_NPC_PRESETS } from './multi-npc.model';

describe('MultiNpcInputComponent', () => {
  let component: MultiNpcInputComponent;
  let fixture: ComponentFixture<MultiNpcInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MultiNpcInputComponent],
      providers: [provideHttpClient()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(MultiNpcInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load multi npc presets', async () => {
    await fixture.whenStable();
    for (const preset of ALL_MULTI_NPC_PRESETS) {
      component.selectedMultiNpcPresetChanged(preset);
    }
  });
});
