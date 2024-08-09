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
  selector: 'app-commit',
  standalone: true,
  imports: [],
  templateUrl: './commit.component.html',
  styleUrl: './commit.component.scss',
})
export class CommitComponent {
  repos!: any;
  repoCommitData: RepositoryCommit[] = [];
  constructor(private dashboardService: DashboardService) {
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
    this.repos.forEach((repo: any) => {
      this.dashboardService
        .getCommitRepo(repo.owner.login, repo.name)
        .subscribe((data: any) => {
          this.repoCommitData.push({
            repoName: repo.name,
            commitCount: data.length,
            start: repo.stargazers_count,
            size: repo.size,
          });
          // Jika semua data telah diambil, buat chart
          if (this.repoCommitData.length === this.repos.length) {
            this.createChartRepo();
          }
        });
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
