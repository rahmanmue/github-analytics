import { Component, ChangeDetectionStrategy } from '@angular/core';
import { DashboardService } from '../../../services/dashboard.service';
import Chart from 'chart.js/auto';
import { Store } from '@ngrx/store';
import { PaginationState } from '../../../state/pagination/pagination.reducer';
import { distinctUntilChanged, forkJoin, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { selectRepos } from '../../../state/repos/repos.selectors';

interface RepositoryCommit {
  repoName: string;
  commitCount: number;
  start: number;
  size: number;
}

@Component({
  selector: 'app-commit',
  standalone: true,
  imports: [],
  templateUrl: './commit.component.html',
  styleUrl: './commit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommitComponent {
  repos$!: Observable<any[]>;
  repoCommitData: RepositoryCommit[] = [];

  constructor(
    private dashboardService: DashboardService,
    private store: Store
  ) {
    this.repos$ = this.store.select(selectRepos);
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
      .subscribe(); // Pastikan untuk meng-subscribe observable
  }

  getCommitAllRepo(repos: any[]) {
    this.repoCommitData = [];

    const repoCommitRequests = repos.map((repo) =>
      this.dashboardService.getCommitRepo(repo.owner.login, repo.name).pipe(
        tap((data: any) => {
          this.repoCommitData.push({
            repoName: repo.name,
            commitCount: data.length,
            start: repo.stargazers_count,
            size: repo.size,
          });
        })
      )
    );

    // Menggunakan forkJoin untuk menunggu semua request selesai
    forkJoin(repoCommitRequests).subscribe(() => {
      // Semua data telah diambil, buat chart
      this.createChartRepo();
    });
  }

  createChartRepo() {
    const repoNames = this.repoCommitData.map((repo) => repo.repoName);
    const commitCounts = this.repoCommitData.map((repo) => repo.commitCount);

    const ctx = document.getElementById(
      'repoCommitStatsChart'
    ) as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: repoNames,
        datasets: [
          {
            label: 'Jumlah Commit per Repositori',
            data: commitCounts,
            backgroundColor: 'rgb(54, 162, 235)', // Gunakan warna biru
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
}
