import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TrailblazerRelic } from '../model/osrs/leagues/trailblazer-relics.model';

@Injectable({
  providedIn: 'root',
})
export class TrailblazerRelicService {
  globalTrailblazerRelics$: BehaviorSubject<Set<TrailblazerRelic>> = new BehaviorSubject(new Set());
}
