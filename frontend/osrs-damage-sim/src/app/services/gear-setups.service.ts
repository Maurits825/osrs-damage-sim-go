import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DAMAGE_SIM_SERVER_URL } from '../constants.const';
import { Item } from '../model/item.model';

@Injectable()
export class GearSetupService {
  constructor(private http: HttpClient) {}

  getGearSetups(): Observable<Record<string, Record<number, Item>>> {
    return this.http.get<Record<string, Record<number, Item>>>(DAMAGE_SIM_SERVER_URL + '/gear-setups');
  }
}
