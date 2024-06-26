import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { DpsGraphData, DpsGrapherResult, DpsGrapherResults } from 'src/app/model/damage-sim/dps-grapher-results.model';
import { InputSetup } from 'src/app/model/damage-sim/input-setup.model';

@Component({
  selector: 'app-dps-graph',
  templateUrl: './dps-graph.component.html',
})
export class DpsGraphComponent implements OnChanges {
  @Input()
  dpsGrapherResults: DpsGrapherResults;

  @Input()
  inputSetup: InputSetup;

  dpsGrapherChart: Chart;

  DpsGrapherResult: DpsGrapherResult;
  selectedDpsGrapherResult: DpsGrapherResult;

  hitDistChart: Chart;
  hideZeroDist = false;

  chartColors = ['blue', 'green', 'red', 'orange', 'purple', 'pink', 'brown', 'yellow', 'teal'];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dpsGrapherResults']) {
      this.selectedDpsGrapherResult = this.dpsGrapherResults.results.find(
        (dpsResult) => dpsResult.graphType === 'Elder maul'
      );
      this.updateDpsGrapherChart();
    }
  }

  selectedGraphResultChange(dpsGrapherResult: DpsGrapherResult): void {
    this.selectedDpsGrapherResult = dpsGrapherResult;
    this.updateDpsGrapherChart();
  }

  updateDpsGrapherChart(): void {
    if (this.dpsGrapherChart) {
      this.dpsGrapherChart.destroy();
    }
    this.dpsGrapherChart = new Chart('dpsGrapherChart', {
      type: 'line',
      data: {
        datasets: [],
      },
    });

    const datasets = this.selectedDpsGrapherResult.dpsData.map((dpsGraphData: DpsGraphData, index: number) => ({
      label: dpsGraphData.label,
      data: dpsGraphData.dps,
      backgroundColor: this.chartColors[index % this.chartColors.length],
    }));

    this.dpsGrapherChart.data = {
      labels: this.selectedDpsGrapherResult.xValues,
      datasets: datasets,
    };

    this.dpsGrapherChart.options = {
      scales: {
        y: {
          title: {
            display: true,
            text: 'Dps',
          },
        },
        x: {
          title: {
            display: true,
            text: this.selectedDpsGrapherResult.graphType,
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            title: (items) => this.selectedDpsGrapherResult.graphType + ': ' + items[0].label,
          },
        },
      },
    };

    this.dpsGrapherChart.update();
  }
}
