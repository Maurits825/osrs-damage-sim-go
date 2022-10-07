import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from '../model/item.model';
import { DAMAGE_SIM_SERVER_URL } from './server-url.cons';

@Injectable()
export class RlGearService {

  constructor(private http: HttpClient) {}

  getGear(): Observable<Record<number, Item>> {
    return this.http.get<Record<number, Item>>(DAMAGE_SIM_SERVER_URL + '/rl-gear');
  }
}
