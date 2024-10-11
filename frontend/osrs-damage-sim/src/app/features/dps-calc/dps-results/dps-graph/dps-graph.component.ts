import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Chart } from 'chart.js/auto';
import {
  GraphData,
  DpsGrapherResult,
  DpsGrapherResults,
  GraphYValue,
  GraphYValues,
} from 'src/app/model/dps-calc/dps-grapher-results.model';
import { InputSetup } from 'src/app/model/dps-calc/input-setup.model';
import { graphTypeOrder, graphYLabel } from './dps-graph.const';

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

  GraphYValue: GraphYValue;
  GraphYValues = [...GraphYValues];
  selectedGraphYValue: GraphYValue = 'dps';
  graphYLabel = graphYLabel;

  hitDistChart: Chart;
  hideZeroDist = false;

  chartColors = ['blue', 'green', 'red', 'orange', 'purple', 'pink', 'brown', 'yellow', 'teal'];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dpsGrapherResults']) {
      //TODO works but adds spacing in dropdown for some reason...
      //maybe refactor to observables and dont use ngonchanges?
      this.dpsGrapherResults.results.sort(
        (r1: DpsGrapherResult, r2: DpsGrapherResult) => graphTypeOrder[r1.graphType] - graphTypeOrder[r2.graphType]
      );

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

  selectedYValueChange(value: GraphYValue): void {
    this.selectedGraphYValue = value;
    this.updateDpsGrapherChart();
  }

  getGraphData(graphData: GraphData, graph: GraphYValue): number[] {
    switch (graph) {
      case 'dps': {
        return graphData.dps;
      }
      case 'expectedHit': {
        return graphData.expectedHit;
      }
      case 'maxHit': {
        return graphData.maxHit;
      }
      case 'accuracy': {
        return graphData.accuracy;
      }
    }
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

    const datasets = this.selectedDpsGrapherResult.graphData.map((graphData: GraphData, index: number) => ({
      label: graphData.label,
      data: this.getGraphData(graphData, this.selectedGraphYValue),
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
            text: graphYLabel[this.selectedGraphYValue],
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
