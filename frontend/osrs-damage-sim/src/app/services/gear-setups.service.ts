import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from '../model/item.model';
import { DAMAGE_SIM_SERVER_URL } from './server-url.cons';

@Injectable()
export class GearSetupService {

  constructor(private http: HttpClient) {}

  getGearSetups(): Observable<Record<string, Record<number, Item>>> {
    return this.http.get<Record<string, Record<number, Item>>>(DAMAGE_SIM_SERVER_URL + '/gear-setups');
  }
}
