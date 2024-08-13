import { Component, OnDestroy } from '@angular/core';
import { DashboardService } from '../../../services/dashboard.service';
import Chart from 'chart.js/auto';
import { distinctUntilChanged, Observable, catchError, of, tap } from 'rxjs';
import { PaginationState } from '../../../state/pagination/pagination.reducer';
import { Store } from '@ngrx/store';
import { selectRepos } from '../../../state/repos/repos.selectors';
import { ReposState } from '../../../state/repos/repos.reducers';

interface RepositoryCommit {
  repoName: string;
  commitCount: number;
  start: number;
  size: number;
}

@Component({
  selector: 'app-size',
  standalone: true,
  imports: [],
  templateUrl: './size.component.html',
  styleUrl: './size.component.scss',
})
export class SizeComponent {
  repos$!: Observable<ReposState['repos']>;
  repoCommitData: RepositoryCommit[] = [];
  private chart!: Chart<'bar', number[], string>;

  constructor(
    private dashboardService: DashboardService,
    private store: Store<{ repos: ReposState }>
  ) {
    this.repos$ = this.store.select((state) => state.repos.repos);
  }

  ngOnInit() {
    this.repos$
      .pipe(
        distinctUntilChanged(),
        tap((repos) => {
          if (repos.length > 0) {
            this.getCommitAllRepo(repos);
          }
        })
      )
      .subscribe();
  }

  getCommitAllRepo(repos: ReposState['repos']) {
    let completedRequests = 0;
    this.repoCommitData = [];

    repos.forEach((repo: any) => {
      this.dashboardService
        .getCommitRepo(repo.owner.login, repo.name)
        .pipe(
          catchError((error) => {
            console.error('Error fetching commit data', error);
            return of([]); // Fallback to empty array on error
          })
        )
        .subscribe((data: any) => {
          if (data.length > 0 && data.status !== 409) {
            this.repoCommitData.push({
              repoName: repo.name,
              commitCount: data.length,
              start: repo.stargazers_count,
              size: repo.size,
            });
          }
          completedRequests++;
          if (completedRequests === repos.length) {
            this.createChartSize();
          }
        });
    });
  }
  createChartSize() {
    const repoNames = this.repoCommitData.map((repo) => repo.repoName);
    const size = this.repoCommitData.map((repo) => repo.size);

    const ctx = document.getElementById('sizeStatsChart') as HTMLCanvasElement;
    if (!ctx) {
      console.error('Canvas element not found');
      return;
    }

    if (this.chart) {
      this.chart.destroy(); // Destroy existing chart before creating a new one
    }

    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: repoNames,
        datasets: [
          {
            label: 'Size per Repositori (KB)',
            data: size,
            backgroundColor: 'rgb(255, 205, 86)',
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy(); // Clean up the chart on component destroy
    }
  }
}
