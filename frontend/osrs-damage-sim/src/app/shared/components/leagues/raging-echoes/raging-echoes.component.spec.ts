import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RagingEchoesComponent } from './raging-echoes.component';
import { DEFAULT_RAGING_ECHOES_SETTINGS } from 'src/app/model/osrs/leagues/raging-echoes.model';

import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('RagingEchoesComponent', () => {
  let component: RagingEchoesComponent;
  let fixture: ComponentFixture<RagingEchoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RagingEchoesComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(RagingEchoesComponent);
    component = fixture.componentInstance;
    component.ragingEchoesSettings = DEFAULT_RAGING_ECHOES_SETTINGS;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
