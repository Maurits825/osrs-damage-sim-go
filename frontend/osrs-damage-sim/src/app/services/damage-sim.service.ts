import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DamageSimResults } from '../model/damage-sim-results.model';
import { InputSetup } from '../model/input-setup.model';
import { Item } from '../model/item.model';
import { Npc } from '../model/npc.model';
import { DAMAGE_SIM_SERVER_URL } from './server-url.cons';

@Injectable()
export class DamageSimService {

  constructor(private http: HttpClient) {}

  getStatus(): Observable<string> {
    console.log('Getting status');
    return this.http.get<string>(DAMAGE_SIM_SERVER_URL + '/status');
  }

  getGearSlotItems(): Observable<Record<number, Record<number, Item>>> {
    return this.http.get<Record<number, Record<number, Item>>>(DAMAGE_SIM_SERVER_URL + '/gear-slot-items');
  }

  getAttackStyles(itemId: number): Observable<string[]> {
    return this.http.get<string[]>(DAMAGE_SIM_SERVER_URL + '/attack-style/' + itemId);
  }

  getAllNpcs(): Observable<Record<number, Npc>> {
    return this.http.get<Record<number, Npc>>(DAMAGE_SIM_SERVER_URL + '/npcs');
  }

  runDamageSim(inputSetup: InputSetup): Observable<DamageSimResults> {
    return this.http.post<DamageSimResults>(DAMAGE_SIM_SERVER_URL + '/run-damage-sim', inputSetup);
  }
}
