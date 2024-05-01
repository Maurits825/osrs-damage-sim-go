export interface Highscore {
  activities: Activity[];
  skills: HighScoreSkill[];
}

export interface Activity {
  id: number;
  name: string;
  rank: number;
  score: number;
}

export interface HighScoreSkill {
  id: number;
  level: number;
  name: string;
  rank: number;
  xp: number;
}
