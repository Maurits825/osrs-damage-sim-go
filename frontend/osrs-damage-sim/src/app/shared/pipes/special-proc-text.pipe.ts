import { Pipe, PipeTransform } from '@angular/core';
import { SpecialProc } from 'src/app/model/damage-sim/damage-sim-results.model';

@Pipe({
  name: 'specialProcText',
})
export class SpecialProcTextPipe implements PipeTransform {
  transform(specialProc: SpecialProc): string {
    console.log('get specialProc text');
    return specialProc.split(/(?=[A-Z])/).join(' ') + ' Proc';
  }
}
