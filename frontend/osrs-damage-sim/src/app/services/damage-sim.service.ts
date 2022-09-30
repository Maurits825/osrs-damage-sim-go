import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GearSlotItems } from '../model/gear_slot_items';

@Injectable()
export class DamageSimService {
  damageSimURL: string = 'http://127.0.0.1:5000/';

  constructor(private http: HttpClient) {}

  getStatus(): Observable<string> {
    console.log('Getting status');
    return this.http.get<string>(this.damageSimURL + '/status');
  }

  getGearSlotItems(): Observable<GearSlotItems> {
    console.log('Getting gear slot items');
    return this.http.get<GearSlotItems>(this.damageSimURL + '/gear-slot-items');
  }
}
