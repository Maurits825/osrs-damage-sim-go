import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GearSetup } from '../model/gear_slot_items';
import { DAMAGE_SIM_SERVER_URL } from './server-url.cons';

@Injectable()
export class GearSetupService {

  constructor(private http: HttpClient) {}

  getGearSetups(): Observable<GearSetup> {
    return this.http.get<GearSetup>(DAMAGE_SIM_SERVER_URL + '/gear-setups');
  }
}
