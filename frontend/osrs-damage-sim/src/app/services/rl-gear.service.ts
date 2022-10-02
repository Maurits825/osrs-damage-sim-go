import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GearSlotItem } from '../model/gear_slot_items.model';
import { DAMAGE_SIM_SERVER_URL } from './server-url.cons';

@Injectable()
export class RlGearService {

  constructor(private http: HttpClient) {}

  getGear(): Observable<GearSlotItem> {
    return this.http.get<GearSlotItem>(DAMAGE_SIM_SERVER_URL + '/rl-gear');
  }
}
