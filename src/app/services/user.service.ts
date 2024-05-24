import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  BASE_API = "https://api.github.com/user"

  constructor(private http: HttpClient) { }

  getUserByToken(token: string){
    return this.http.get<any>(this.BASE_API, {
      headers : {
        'Content-Type': 'application/json',
        'Authorization' : `Bearer ${token}`
      },
      responseType : 'json',
    })
  }


  getUser(){
    return this.http.get<any>(this.BASE_API)
  }

  updateUserProfile(body: any){
    return this.http.patch(this.BASE_API, body)
  }


 

}
