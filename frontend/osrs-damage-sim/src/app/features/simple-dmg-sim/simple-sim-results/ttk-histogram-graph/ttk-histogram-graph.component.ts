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

    //TODO dupe code -> make service/util fn?
    const maxTtk = this.simpleSimResults.reduce(
      (max: number, r: SimpleSimResult) => (r.ttkHistogram.length > max ? r.ttkHistogram.length : max),
      0,
    );

    let minTtk = this.simpleSimResults.reduce((min: number, r: SimpleSimResult) => {
      const ttk = r.cummulativeTtk.findIndex((ttk: number) => ttk > 0);
      if (ttk < min) {
        return ttk;
      }
      return min;
    }, maxTtk);
    minTtk = Math.round(minTtk - minTtk * 0.4);

    const xValues = Array<string>(maxTtk - minTtk);
    for (let i = minTtk; i < maxTtk; i++) {
      xValues[i - minTtk] = this.tickToTimePipe.transform(i);
    }

    const datasets = this.simpleSimResults.map((result: SimpleSimResult, index: number) => ({
      label: 'Setup ' + (index + 1), //todo names
      data: result.ttkHistogram.slice(minTtk),
      backgroundColor: this.chartColors[index % this.chartColors.length],
      barThickness: 3,
    }));

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
