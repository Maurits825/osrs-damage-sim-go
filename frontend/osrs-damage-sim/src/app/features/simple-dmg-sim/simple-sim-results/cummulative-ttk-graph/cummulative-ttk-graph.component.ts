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

    const maxTtk = this.simpleSimResults.reduce(
      (max: number, r: SimpleSimResult) => (r.cummulativeTtk.length > max ? r.cummulativeTtk.length : max),
      0,
    );

    let minTtk = this.simpleSimResults.reduce((min: number, r: SimpleSimResult) => {
      const ttk = r.cummulativeTtk.findIndex((ttk: number) => ttk > 0);
      if (ttk < min) {
        return ttk;
      }
      return min;
    }, maxTtk);
    //TODO maybe just take diff from avg to max and get min from that
    minTtk = Math.round(minTtk - minTtk * 0.4);

    const xValues = Array<string>(maxTtk - minTtk);
    for (let i = minTtk; i < maxTtk; i++) {
      xValues[i - minTtk] = this.tickToTimePipe.transform(i);
    }

    const datasets = this.simpleSimResults.map((result: SimpleSimResult, index: number) => ({
      label: 'Setup ' + (index + 1), //todo names
      data: result.cummulativeTtk.slice(minTtk),
      backgroundColor: this.chartColors[index % this.chartColors.length],
    }));

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
