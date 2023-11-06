import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TrailblazerRelic, allTrailblazerRelics } from 'src/app/model/osrs/leagues/trailblazer-relics.model';

@Component({
  selector: 'app-trailblazer-relics',
  templateUrl: './trailblazer-relics.component.html',
  styleUrls: ['./trailblazer-relics.component.css'],
})
export class TrailblazerRelicsComponent {
  @Input()
  trailblazerRelics: Set<TrailblazerRelic>;

  @Output()
  trailblazerRelicsChanged = new EventEmitter<Set<TrailblazerRelic>>();

  allRelics = allTrailblazerRelics;

  onTrailblazerRelicsChanged(relic: TrailblazerRelic): void {
    if (this.trailblazerRelics.has(relic)) {
      this.trailblazerRelics.delete(relic);
    } else {
      this.trailblazerRelics.add(relic);
    }

    this.trailblazerRelicsChanged.emit(this.trailblazerRelics);
  }
}
