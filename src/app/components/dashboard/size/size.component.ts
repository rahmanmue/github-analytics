import { Component } from '@angular/core';
import { DashboardService } from '../../../services/dashboard.service';
import Chart from 'chart.js/auto';

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
  repos!: any;
  repoCommitData: RepositoryCommit[] = [];
  constructor(private dashboardService: DashboardService) {
    this.getRepos();
  }

  getRepos() {
    this.dashboardService.getRepos().subscribe({
      next: (data) => {
        this.repos = data;
        this.getCommitAllRepo();
      },
      error: (err) => console.log(err),
    });
  }

  getCommitAllRepo() {
    this.repoCommitData = [];
    let completedRequests = 0;

    if (this.repos.length === 0) {
      this.createChartSize();
      return;
    }

    this.repos.forEach((repo: any) => {
      this.dashboardService
        .getCommitRepo(repo.owner.login, repo.name)
        .subscribe({
          next: (data: any) => {
            if (data.status !== 409) {
              const commitCount = data.length;
              this.repoCommitData.push({
                repoName: repo.name,
                commitCount: commitCount,
                start: repo.stargazers_count,
                size: repo.size,
              });
            }
            completedRequests++;

            // Jika semua data telah diambil, buat chart
            if (completedRequests === this.repos.length) {
              this.createChartSize();
            }
          },
          error: (error) => {
            console.error('Error fetching commit data', error);
            completedRequests++;

            // Handle the case where there is an error but still want to proceed with chart creation
            if (completedRequests === this.repos.length) {
              this.createChartSize();
            }
          },
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

    new Chart(ctx, {
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
}
