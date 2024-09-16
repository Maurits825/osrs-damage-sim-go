import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tickToTime',
})
export class TickToTimePipe implements PipeTransform {
  transform(tick: number): string {
    const totalSeconds: number = tick * 0.6;
    const minutes: number = Math.floor(totalSeconds / 60);
    const seconds: number = Math.round((totalSeconds % 60) * 10) / 10;

    const secondsStr: string = ('0' + seconds.toFixed(1)).slice(-4);
    return `${minutes}:${secondsStr}`;
  }
}
