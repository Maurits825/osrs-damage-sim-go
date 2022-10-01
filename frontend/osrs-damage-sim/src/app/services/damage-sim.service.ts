import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GearSlotItems } from '../model/gear_slot_items';
import { DAMAGE_SIM_SERVER_URL } from './server-url.cons';

@Injectable()
export class DamageSimService {

  constructor(private http: HttpClient) {}

  getStatus(): Observable<string> {
    console.log('Getting status');
    return this.http.get<string>(DAMAGE_SIM_SERVER_URL + '/status');
  }

  getGearSlotItems(): Observable<GearSlotItems> {
    return this.http.get<GearSlotItems>(DAMAGE_SIM_SERVER_URL + '/gear-slot-items');
  }
}
