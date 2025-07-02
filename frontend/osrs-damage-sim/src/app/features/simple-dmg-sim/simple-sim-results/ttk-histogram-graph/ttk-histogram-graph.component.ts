import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SimpleSimResult } from 'src/app/model/simple-dmg-sim/simple-sim-results.model';
import { Chart } from 'chart.js/auto';
import { TickToTimePipe } from 'src/app/shared/pipes/tick-to-time.pipe';

@Component({
  selector: 'app-ttk-histogram-graph',
  templateUrl: './ttk-histogram-graph.component.html',
})
export class TtkHistogramGraphComponent implements OnChanges {
  //TODO passing the inputs twice across components is annoying...
  @Input()
  simpleSimResults: SimpleSimResult[];

  ttkHistogramChart: Chart;
  chartColors = ['blue', 'green', 'red', 'orange', 'purple', 'pink', 'brown', 'yellow', 'teal'];

  constructor(private tickToTimePipe: TickToTimePipe) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['simpleSimResults']) {
      this.updatettkHistogramChart();
    }
  }

  updatettkHistogramChart(): void {
    if (this.ttkHistogramChart) {
      this.ttkHistogramChart.destroy();
    }
    this.ttkHistogramChart = new Chart('ttkHistogramChart', {
      type: 'bar',
      data: {
        datasets: [],
      },
    });

    const datasets = this.simpleSimResults.map((result: SimpleSimResult, index: number) => ({
      label: 'Input Setup ' + index + 1, //todo names
      data: result.ttkHistogram,
      backgroundColor: this.chartColors[index % this.chartColors.length],
      barThickness: 3,
    }));

    const maxLength = this.simpleSimResults.reduce(
      (max: number, r: SimpleSimResult) => (r.ttkHistogram.length > max ? r.ttkHistogram.length : max),
      0,
    );
    const xValues = Array<string>(maxLength);
    for (let i = 0; i < maxLength; i++) {
      xValues[i] = this.tickToTimePipe.transform(i);
    }

    this.ttkHistogramChart.data = {
      labels: xValues,
      datasets: datasets,
    };

    this.ttkHistogramChart.options = {
      scales: {
        y: {
          title: {
            display: true,
            text: 'Samples',
          },
        },
        x: {
          offset: true,
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

    this.ttkHistogramChart.update();
  }
}
