import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { DashboardService } from '../../../services/dashboard.service';
import Chart from 'chart.js/auto';

interface LanguageCount {
  name: string;
  count: number;
}

@Component({
  selector: 'app-repository',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './repository.component.html',
  styleUrl: './repository.component.scss'
})
export class RepositoryComponent {
  repos!:any;
  dataChart:any
  chart: any;

  constructor(private dashboardService: DashboardService){
    this.getRepos()
  }

  getRepos(){
    this.dashboardService.getRepos(localStorage.getItem('username') as string).subscribe({
      next: data => {
        // console.log(data)
        this.repos = data;
        this.dataChart = this.countProgrammingLanguages(data);
        this.createChartLanguageProgramming();
      }, 
      error: err => console.log(err)
    });
  }

  countProgrammingLanguages(array: any): LanguageCount[] {
    let languageCounts: { [key: string]: number } = {};

    array.forEach((item: { language: string }) => {
      if (item.language) {
        if (languageCounts[item.language]) {
          languageCounts[item.language]++;
        } else {
          languageCounts[item.language] = 1;
        }
      }
    });

    // Mengonversi objek ke dalam bentuk array LanguageCount
    let resultArray: LanguageCount[] = Object.keys(languageCounts)
      .map(key => ({ name: key, count: languageCounts[key] }));

    return resultArray;
  }

  createChartLanguageProgramming(){
    console.log("chart", this.dataChart);
    if (this.chart) {
      this.chart.destroy(); // Hapus chart yang ada jika ada sebelumnya
    }
    this.chart = new Chart("programmingLanguageChart", {
      type: 'doughnut', 
      data: {
        labels: this.dataChart.map((language: { name: any; }) => language.name), // Gunakan nama bahasa pemrograman sebagai label
        datasets: [{
          label: "Programming Languages",
          data: this.dataChart.map((language: { count: any; }) => language.count), // Gunakan jumlah bahasa pemrograman sebagai data
          backgroundColor: [
            'rgb(255, 99, 132)',    // Merah
            'rgb(255, 205, 86)',    // Kuning
            'rgb(54, 162, 235)',    // Biru
            'rgb(75, 192, 192)',    // Hijau biru
            'rgb(153, 102, 255)',   // Ungu
            'rgb(255, 159, 64)',    // Oranye
            'rgb(0, 255, 255)'      // Aqua
          ]        
        }]
      },
      options: {
        aspectRatio: 1.2
      }
    })
  }


}
