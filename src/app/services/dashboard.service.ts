import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  BASE_API = 'https://api.github.com';

  constructor(private http: HttpClient) {}

  getRepos(page = 1, per_page = 10) {
    return this.http.get(
      `${this.BASE_API}/user/repos?per_page=${per_page}&page=${page}`
    );
  }

  getCommitRepo(owner: string, repo: string) {
    return this.http.get(`${this.BASE_API}/repos/${owner}/${repo}/commits`);
  }
}
