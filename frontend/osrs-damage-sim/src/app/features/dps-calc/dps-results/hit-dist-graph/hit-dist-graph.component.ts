import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { DpsCalcResult, DpsCalcResults } from 'src/app/model/damage-sim/dps-results.model';
import { InputSetup } from 'src/app/model/damage-sim/input-setup.model';

@Component({
  selector: 'app-hit-dist-graph',
  templateUrl: './hit-dist-graph.component.html',
})
export class HitDistGraphComponent implements OnChanges {
  @Input()
  dpsCalcResults: DpsCalcResults;

  @Input()
  inputSetup: InputSetup;

  @Input()
  showResultTextLabel: boolean;

  DpsCalcResult: DpsCalcResult;
  selectedDpsCalcResult: DpsCalcResult;
  selectedDpsCalcResultIndex: number;

  hitDistChart: Chart;
  hideZeroDist = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dpsCalcResults']) {
      this.selectedDpsCalcResultIndex = 0;
      this.selectedDpsCalcResult = this.dpsCalcResults.results[this.selectedDpsCalcResultIndex];
      this.updateHitDistChart();
    }
  }

  selectedDpsResultChange(dpsCalcResult: DpsCalcResult): void {
    this.selectedDpsCalcResult = dpsCalcResult;
    this.selectedDpsCalcResultIndex = this.dpsCalcResults.results.findIndex(
      (calcResult) => calcResult === dpsCalcResult
    );
    this.updateHitDistChart();
  }

  updateHitDistChart(): void {
    if (this.hitDistChart) {
      this.hitDistChart.destroy();
    }
    this.hitDistChart = new Chart('hitDistChart', {
      type: 'bar',
      data: {
        datasets: [],
      },
    });

    const labels = new Array<number>(this.selectedDpsCalcResult.hitDist.length);
    for (let i = 0; i < this.selectedDpsCalcResult.hitDist.length; i++) {
      labels[i] = i;
    }

    const start = this.hideZeroDist ? 1 : 0;
    this.hitDistChart.data = {
      labels: labels.slice(start),
      datasets: [
        {
          label: 'Hit Distribution',
          data: this.selectedDpsCalcResult.hitDist.slice(start),
        },
      ],
    };

    this.hitDistChart.options = {
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
            text: 'Total damage',
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    };

    this.hitDistChart.update();
  }

  hideZeroDistChange(isHide: boolean): void {
    this.hideZeroDist = isHide;
    this.updateHitDistChart();
  }

  dpsCalcFilter(result: DpsCalcResult, searchTerm: string): boolean {
    if (!searchTerm) return true;

    const name = result.labels.gearSetupName;

    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      name
        .replace(/[^0-9a-z]/gi, '')
        .toLowerCase()
        .includes(searchTerm.replace(/[^0-9a-z]/gi, '').toLowerCase())
    );
  }
}
