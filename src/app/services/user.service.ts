import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  BASE_API = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) {}

  getUser() {
    return this.http.get<any>(this.BASE_API);
  }

  updateUserProfile(body: any) {
    return this.http.patch(this.BASE_API, body);
  }
}
