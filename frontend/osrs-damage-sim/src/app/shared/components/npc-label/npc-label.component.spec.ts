import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NpcLabelComponent } from './npc-label.component';
import { Npc } from 'src/app/model/osrs/npc.model';

import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('NpcLabelComponent', () => {
  let component: NpcLabelComponent;
  let fixture: ComponentFixture<NpcLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NpcLabelComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(NpcLabelComponent);
    component = fixture.componentInstance;
    component.npc = { name: 'Test NPC', id: '1', combat: 20, hitpoints: 100 } as Npc;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
