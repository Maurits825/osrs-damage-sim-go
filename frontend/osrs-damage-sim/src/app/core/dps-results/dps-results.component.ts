import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { DpsResults, DpsCalcResult } from 'src/app/model/damage-sim/dps-results.model';
import { DpsGraphData, DpsGrapherResult } from 'src/app/model/damage-sim/dps-grapher-results.model';
import { SortConfigs, SortOrder, dpsSortFields, sortLabels, DpsSortField } from 'src/app/model/damage-sim/sort.model';

@Component({
  selector: 'app-dps-results',
  templateUrl: './dps-results.component.html',
  styleUrls: ['./dps-results.component.css'],
})
export class DpsResultsComponent implements OnChanges {
  @Input()
  dpsResults: DpsResults;

  sortConfigs: Partial<SortConfigs> = {
    theoretical_dps: { sortOrder: SortOrder.Ascending, isSorted: false },
    max_hit: { sortOrder: SortOrder.Ascending, isSorted: false },
    accuracy: { sortOrder: SortOrder.Ascending, isSorted: false },
  };

  SortOrder = SortOrder;
  dpsSortFields = dpsSortFields;
  sortLabels = sortLabels;

  DpsGrapherResult: DpsGrapherResult;
  selectedGraphResult: DpsGrapherResult;
  chart: Chart;

  chartColors = ['blue', 'green', 'red', 'orange', 'purple', 'pink', 'brown', 'yellow', 'teal'];

  constructor(private cd: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dpsResults'] && this.dpsResults && !this.dpsResults.error) {
      this.sortConfigs.theoretical_dps.sortOrder = SortOrder.Descending;
      this.sortDpsResults('theoretical_dps');

      this.selectedGraphResult = this.dpsResults.dpsGrapherResults.results[0];
      this.cd.detectChanges();
      this.createChart();
      this.updateChart();
    }
  }

  sortDpsResults(dpsSortField: DpsSortField): void {
    const sortOrder = this.sortConfigs[dpsSortField].sortOrder;
    this.dpsResults.dpsCalcResults.results.sort((result1: DpsCalcResult, result2: DpsCalcResult) => {
      if (typeof result1[dpsSortField] === 'number') {
        return sortOrder * ((result1[dpsSortField] as number) - (result2[dpsSortField] as number));
      }
      return (
        sortOrder *
        ((result1[dpsSortField] as number[][0] as number) - (result2[dpsSortField] as number[][0] as number))
      );
    });

    this.updateSortConfigs(dpsSortField);
  }

  updateSortConfigs(sortField: DpsSortField): void {
    this.dpsSortFields.forEach((field: DpsSortField) => (this.sortConfigs[field].isSorted = false));

    this.sortConfigs[sortField].isSorted = true;
    this.sortConfigs[sortField].sortOrder *= -1;
  }

  selectedGraphResultChange(dpsGrapherResult: DpsGrapherResult): void {
    this.selectedGraphResult = dpsGrapherResult;
    this.updateChart();
  }

  createChart() {
    this.chart = new Chart('MyChart', {
      type: 'line',
      data: {
        datasets: [],
      },
    });
  }

  updateChart(): void {
    const datasets = this.selectedGraphResult.dpsData.map((dpsGraphData: DpsGraphData, index: number) => ({
      label: dpsGraphData.label,
      data: dpsGraphData.dps,
      backgroundColor: this.chartColors[index % this.chartColors.length],
    }));

    this.chart.data = {
      labels: this.selectedGraphResult.xValues,
      datasets: datasets,
    };

    this.chart.options = {
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
            text: this.selectedGraphResult.graphType,
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            title: (items) => this.selectedGraphResult.graphType + ': ' + items[0].label,
          },
        },
      },
    };

    this.chart.update();
  }
}
