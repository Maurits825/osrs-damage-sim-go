import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import Chart from 'chart.js/auto';
import { DpsCalcResult, DpsCalcResults } from 'src/app/model/dps-calc/dps-results.model';
import { InputSetup } from 'src/app/model/dps-calc/input-setup.model';

@Component({
  selector: 'app-hit-chance-graph',
  templateUrl: './hit-chance-graph.component.html',
})
export class HitChanceGraphComponent implements OnChanges {
  @Input()
  dpsCalcResults: DpsCalcResults;

  @Input()
  inputSetup: InputSetup;

  DpsCalcResult: DpsCalcResult;
  selectedDpsCalcResult: DpsCalcResult;
  selectedDpsCalcResultIndex: number;

  hitChanceChart: Chart;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dpsCalcResults']) {
      this.selectedDpsResultChange(this.dpsCalcResults.results[0]);
    }
  }

  selectedDpsResultChange(dpsCalcResult: DpsCalcResult): void {
    this.selectedDpsCalcResult = dpsCalcResult;
    this.selectedDpsCalcResultIndex = this.dpsCalcResults.results.findIndex(
      (calcResult) => calcResult === dpsCalcResult,
    );
    this.updateHitChanceChart();
  }

  updateHitChanceChart(): void {
    if (this.hitChanceChart) {
      this.hitChanceChart.destroy();
    }
    this.hitChanceChart = new Chart('hitChanceChart', {
      type: 'bar',
      data: {
        datasets: [],
      },
    });

    const labels = new Array<number>(this.selectedDpsCalcResult.hitDist.length);
    for (let i = 0; i < this.selectedDpsCalcResult.hitDist.length; i++) {
      labels[i] = i;
    }

    this.hitChanceChart.data = {
      labels: labels,
      datasets: [
        {
          label: 'Chance',
          data: this.getCummulativeHitChance(this.selectedDpsCalcResult.hitDist),
        },
      ],
    };

    this.hitChanceChart.options = {
      scales: {
        y: {
          title: {
            display: true,
            text: 'Chance %',
          },
        },
        x: {
          title: {
            display: true,
            text: 'Damage',
          },
        },
      },
      plugins: {
        title: {
          display: true,
          text: 'Chance to hit damage or higher',
        },
        legend: {
          display: false,
        },
      },
    };

    this.hitChanceChart.update();
  }

  getCummulativeHitChance(dist: number[]): number[] {
    const hitChance = [];
    let p = 100;
    for (let index = 0; index < dist.length; index++) {
      hitChance.push(p);
      p -= dist[index];
    }
    return hitChance;
  }
}
