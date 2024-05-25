import { Component } from '@angular/core';
import { DashboardService } from '../../../services/dashboard.service';
import Chart from 'chart.js/auto';


interface RepositoryCommit {
  repoName: string;
  commitCount: number;
  start: number;
  size: number
}


@Component({
  selector: 'app-size',
  standalone: true,
  imports: [],
  templateUrl: './size.component.html',
  styleUrl: './size.component.scss'
})
export class SizeComponent {
  repos!:any;
  repoCommitData: RepositoryCommit[] = [];
  constructor(private dashboardService: DashboardService){
    this.dashboardService.getRepos(localStorage.getItem('username') as string).subscribe({
      next: data => {
        this.repos = data;
        this.getCommitAllRepo();
      }, 
      error: err => console.log(err)
    });
  }

  getCommitAllRepo(){
    this.repoCommitData = []; 
    this.repos.forEach((repo : any) => {
      this.dashboardService.getCommitRepo(localStorage.getItem('username') as string, repo.name)
      .subscribe((data: any) => {
        const commitCount = data.length;
        this.repoCommitData.push({ repoName: repo.name, commitCount: commitCount, start: repo.stargazers_count, size: repo.size });
        // Jika semua data telah diambil, buat chart
        if (this.repoCommitData.length === this.repos.length) {
          this.createChartSize();
        }
      });
    });

  }


  createChartSize(){
    const repoNames = this.repoCommitData.map(repo => repo.repoName);
    const size = this.repoCommitData.map(repo => repo.size);
    // console.log("repo",repoNames)
    // console.log("size",size)
   
    const ctx = document.getElementById('sizeStatsChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: repoNames,
        datasets: [{
          label: 'Size per Repositori (KB)',
          data: size,
          backgroundColor: 'rgb(255, 205, 86)',
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }



}
