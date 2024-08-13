import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  BASE_API = `${environment.apiUrl}/user`;
  constructor(private http: HttpClient) {}

  login(token: string) {
    return this.http.get<any>(this.BASE_API, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      responseType: 'json',
    });
  }
}
