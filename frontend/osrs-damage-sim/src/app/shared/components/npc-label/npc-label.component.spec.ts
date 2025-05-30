import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NpcLabelComponent } from './npc-label.component';
import { Npc } from 'src/app/model/osrs/npc.model';

describe('NpcLabelComponent', () => {
  let component: NpcLabelComponent;
  let fixture: ComponentFixture<NpcLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NpcLabelComponent],
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
