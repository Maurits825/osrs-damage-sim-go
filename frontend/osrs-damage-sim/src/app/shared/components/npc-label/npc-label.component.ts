import { Component, Input } from '@angular/core';
import { Npc } from 'src/app/model/osrs/npc.model';

@Component({
  selector: 'app-npc-label',
  templateUrl: './npc-label.component.html',
})
export class NpcLabelComponent {
  @Input()
  npc: Npc;
}
