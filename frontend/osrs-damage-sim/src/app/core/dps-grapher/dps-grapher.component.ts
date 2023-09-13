import { Component } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { DpsGraphData, DpsGraphDpsData, DpsGrapherResults } from 'src/app/model/dps-grapher/dps-grapher-results.model';
import { Mode } from 'src/app/model/mode.enum';
import { DamageSimService } from 'src/app/services/damage-sim.service';
import { InputSetupService } from 'src/app/services/input-setup.service';

@Component({
  selector: 'app-dps-grapher',
  templateUrl: './dps-grapher.component.html',
  styleUrls: ['./dps-grapher.component.css'],
})
export class DpsGrapherComponent {
  Mode = Mode;

  loading = false;

  dpsGrapherResults: DpsGrapherResults;

  chart: Chart;

  private graphColors = ['blue', 'orange', 'green', 'red', 'purple'];

  constructor(private damageSimservice: DamageSimService, private inputSetupService: InputSetupService) {}

  runDpsGrapher(): void {
    this.loading = true;

    const dpsGrapherInputJson = this.inputSetupService.getDpsGrapherInputAsJson();

    this.damageSimservice.runDpsGrapher(dpsGrapherInputJson).subscribe({
      next: (results: DpsGrapherResults) => {
        this.loading = false;
        this.dpsGrapherResults = results;
        // this.createChart(results.graph_data); //TODO graph style and size
      },
      error: (error) => {
        this.loading = false;
        this.dpsGrapherResults = { ...this.dpsGrapherResults, error: error.statusText };
      },
    });
  }

  createChart(dpsGraphData: DpsGraphData) {
    this.chart?.destroy();
    this.chart = new Chart('DpsGraph', {
      type: 'line',
      data: {
        labels: dpsGraphData.x_values,
        datasets: dpsGraphData.dps_data.map((dpsGraphDpsData: DpsGraphDpsData, index: number) => {
          return {
            label: dpsGraphDpsData.label,
            data: dpsGraphDpsData.dps,
            backgroundColor: this.graphColors[index],
          };
        }),
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: dpsGraphData.x_label,
            },
          },
          y: {
            title: {
              display: true,
              text: 'Dps',
            },
          },
        },
      },
    });
  }
}
