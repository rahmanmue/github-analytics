import { AsyncPipe, DatePipe, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { DashboardService } from '../../../services/dashboard.service';
import Chart from 'chart.js/auto';
import { PaginationComponent } from '../../pagination/pagination.component';
import { PaginationState } from '../../../state/pagination/pagination.reducer';
import { Store } from '@ngrx/store';
import { distinctUntilChanged, Observable, tap } from 'rxjs';
import * as PaginationActions from '../../../state/pagination/pagination.actions';
import { selectRepos } from '../../../state/repos/repos.selectors';
import * as ReposActions from '../../../state/repos/repos.actions';
import { selectPagination } from '../../../state/pagination/pagination.selectors';

interface LanguageCount {
  name: string;
  count: number;
}

@Component({
  selector: 'app-repository',
  standalone: true,
  imports: [DatePipe, PaginationComponent, AsyncPipe, NgFor],
  templateUrl: './repository.component.html',
  styleUrl: './repository.component.scss',
})
export class RepositoryComponent {
  repos$!: Observable<any[]>;
  dataChart!: LanguageCount[];
  private chart!: Chart<'doughnut', number[], string>;
  paginationState$!: Observable<PaginationState>;
  currPage!: number;

  constructor(
    private dashboardService: DashboardService,
    private store: Store
  ) {
    this.paginationState$ = this.store.select(selectPagination);
    this.repos$ = this.store.select(selectRepos);
  }

  ngOnInit() {
    this.paginationState$
      .pipe(
        distinctUntilChanged(
          (prev, curr) =>
            prev.currentPage === curr.currentPage &&
            prev.perPage === curr.perPage
        )
      )
      .subscribe((state) => {
        this.currPage = state.currentPage;
        this.getRepos(state.currentPage, state.perPage);
      });
  }

  getRepos(page: number, per_page: number) {
    this.dashboardService
      .getRepos(page, per_page)
      .pipe(
        tap((data: any) => {
          this.store.dispatch(
            PaginationActions.setTotalItems({ totalItems: data.length })
          );

          if (data.length !== 0) {
            this.store.dispatch(ReposActions.setRepos({ repos: data }));
            const newDataChart = this.countProgrammingLanguages(data);

            // Hanya update chart jika data benar-benar berubah
            if (
              JSON.stringify(this.dataChart) !== JSON.stringify(newDataChart)
            ) {
              this.dataChart = newDataChart;
              this.updateChart();
            }
          } else {
            this.store.dispatch(
              PaginationActions.setCurrentPage({
                currentPage: this.currPage - 1,
              })
            );
            alert('Data not found'); // Ganti alert dengan log
          }
        })
      )
      .subscribe({
        error: (err) => console.log(err),
      });
  }

  countProgrammingLanguages(array: any): LanguageCount[] {
    const languageCounts: { [key: string]: number } = {};

    array.forEach((item: { language: string }) => {
      if (item.language) {
        if (languageCounts[item.language]) {
          languageCounts[item.language]++;
        } else {
          languageCounts[item.language] = 1;
        }
      }
    });

    return Object.keys(languageCounts).map((key) => ({
      name: key,
      count: languageCounts[key],
    }));
  }

  createChartLanguageProgramming() {
    this.chart = new Chart('programmingLanguageChart', {
      type: 'doughnut',
      data: {
        labels: this.dataChart.map((language) => language.name),
        datasets: [
          {
            label: 'Programming Languages',
            data: this.dataChart.map((language) => language.count),
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(255, 205, 86)',
              'rgb(54, 162, 235)',
              'rgb(75, 192, 192)',
              'rgb(153, 102, 255)',
              'rgb(255, 159, 64)',
              'rgb(0, 255, 255)',
            ],
          },
        ],
      },
      options: {
        aspectRatio: 1.2,
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.raw || 0;
                return `${label}: ${value}`;
              },
            },
          },
        },
      },
    });
  }

  updateChart() {
    if (this.chart) {
      this.chart.data.labels = this.dataChart.map((language) => language.name);
      this.chart.data.datasets[0].data = this.dataChart.map(
        (language) => language.count
      );
      this.chart.update(); // Update chart instead of destroying and recreating
    } else {
      this.createChartLanguageProgramming(); // Create chart if it doesn't exist
    }
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy(); // Destroy chart on component destruction to prevent memory leaks
    }
  }
}
