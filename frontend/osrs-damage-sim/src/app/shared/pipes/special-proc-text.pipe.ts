import { Pipe, PipeTransform } from '@angular/core';
import { SpecialProc } from 'src/app/model/shared/dmg-sim-results.model';

@Pipe({
  name: 'specialProcText',
})
export class SpecialProcTextPipe implements PipeTransform {
  transform(specialProc: SpecialProc): string {
    return specialProc.split(/(?=[A-Z])/).join(' ') + ' Proc';
  }
}
