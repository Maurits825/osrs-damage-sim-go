import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DpsResults } from '../model/dps-calc/dps-results.model';
import { CombatStats, Skill } from '../model/osrs/skill.type';
import { RuneliteGear } from '../model/shared/runelite-gear.model';
import { Highscore, HighScoreSkill } from '../model/osrs/highscore.model';
import { BisCalcResults } from '../model/bis-calc/bis-calc-result.model';
import { SimpleSimResults } from '../model/simple-dmg-sim/simple-sim-results.model';

@Injectable({
  providedIn: 'root',
})
export class DamageSimService {
  private damageSimServiceUrl = environment.OSRS_DAMAGE_SIM_SERVICE_URL;

  constructor(private http: HttpClient) {}

  public getStatus(): Observable<string> {
    return this.http.get<string>(this.damageSimServiceUrl + '/status');
  }

  public runDpsCalc(inputSetupJson: string): Observable<DpsResults> {
    return this.postDamageService(inputSetupJson, '/run-dps-calc');
  }

  public runSimpleSim(inputSetupJson: string): Observable<SimpleSimResults> {
    return this.postDamageService(inputSetupJson, '/run-simple-dmg-sim');
  }

  public runBisCalc(inputSetupJson: string): Observable<BisCalcResults> {
    return this.postDamageService(inputSetupJson, '/run-bis-calc');
  }

  public getWikiDpsShortlink(inputSetupJson: string): Observable<string> {
    return this.postDamageService(inputSetupJson, '/wiki-dps-shortlink');
  }

  public lookupHighscore(rsn: string): Observable<CombatStats> {
    return this.http.get<Highscore>(this.damageSimServiceUrl + '/lookup-highscore?player=' + rsn).pipe(
      map((highscore: Highscore) => highscore.skills),
      map((skills: HighScoreSkill[]) =>
        skills.reduce((combatStats: CombatStats, skills: HighScoreSkill) => {
          combatStats[skills.name.toLowerCase() as Skill] = skills.level;
          return combatStats;
        }, {} as CombatStats)
      )
    );
  }

  public getRuneliteGearSetup(): Observable<number[]> {
    return this.http.get<RuneliteGear[]>('http://localhost:8080/equip').pipe(
      map((equipment: RuneliteGear[]) => equipment ?? []),
      map((equipment: RuneliteGear[]) =>
        equipment.filter((item: RuneliteGear) => item.id !== -1).map((item: RuneliteGear) => item.id)
      )
    );
  }

  private postDamageService<T>(inputJson: string, endpoint: string): Observable<T> {
    const options = { headers: { 'Content-Type': 'application/json' } };
    return this.http.post<T>(this.damageSimServiceUrl + endpoint, inputJson, options);
  }
}
