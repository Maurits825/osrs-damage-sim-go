import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maxHit',
})
export class MaxHitPipe implements PipeTransform {
  transform(maxHits: number[]): string {
    if (maxHits.length == 1) return maxHits[0].toString();

    let maxHit = 0;
    let maxHitText = '';
    for (let i = 0; i < maxHits.length; i++) {
      maxHit += maxHits[i];
      maxHitText += maxHits[i].toString() + ' ';
    }

    return maxHit + ': ' + maxHitText.slice(0, -1);
  }
}
