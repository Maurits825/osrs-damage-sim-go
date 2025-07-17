import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SimpleSimResult } from 'src/app/model/simple-dmg-sim/simple-sim-results.model';
import { Chart } from 'chart.js/auto';
import { TickToTimePipe } from 'src/app/shared/pipes/tick-to-time.pipe';

@Component({
  selector: 'app-cummulative-ttk-graph',
  templateUrl: './cummulative-ttk-graph.component.html',
})
export class CummulativeTtkGraphComponent implements OnChanges {
  //TODO passing the inputs twice across components is annoying...
  @Input()
  simpleSimResults: SimpleSimResult[];

  cumTtkChart: Chart;
  chartColors = ['blue', 'green', 'red', 'orange', 'purple', 'pink', 'brown', 'yellow', 'teal'];

  constructor(private tickToTimePipe: TickToTimePipe) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['simpleSimResults']) {
      this.updateCumTtkChart();
    }
  }

  updateCumTtkChart(): void {
    if (this.cumTtkChart) {
      this.cumTtkChart.destroy();
    }
    this.cumTtkChart = new Chart('cumTtkChart', {
      type: 'line',
      data: {
        datasets: [],
      },
    });

    const datasets = this.simpleSimResults.map((result: SimpleSimResult, index: number) => ({
      label: 'Setup ' + (index + 1), //todo names
      data: result.cummulativeTtk,
      backgroundColor: this.chartColors[index % this.chartColors.length],
    }));

    const maxLength = this.simpleSimResults.reduce(
      (max: number, r: SimpleSimResult) => (r.cummulativeTtk.length > max ? r.cummulativeTtk.length : max),
      0,
    );
    const xValues = Array<string>(maxLength);
    for (let i = 0; i < maxLength; i++) {
      xValues[i] = this.tickToTimePipe.transform(i);
    }

    this.cumTtkChart.data = {
      labels: xValues,
      datasets: datasets,
    };

    this.cumTtkChart.options = {
      scales: {
        y: {
          title: {
            display: true,
            text: 'Cummulative Probability',
          },
        },
        x: {
          title: {
            display: true,
            text: 'Time to Kill',
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            title: (items) => 'TTK: ' + items[0].label,
          },
        },
      },
    };

    this.cumTtkChart.update();
  }
}
