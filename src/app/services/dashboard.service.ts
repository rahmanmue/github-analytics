import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  BASE_API = "https://api.github.com"

  constructor(private http: HttpClient) { }

  getRepos(username:string){
    return this.http.get(`${this.BASE_API}/users/${username}/repos`);
  }

  getCommitRepo(username:string, repo:string){
    return this.http.get(`${this.BASE_API}/repos/${username}/${repo}/commits`)
  }

}
