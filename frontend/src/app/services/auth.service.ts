import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  getAuth() {
    let authUrl = 'http://localhost:3000/authorization';
    this.http.get<any>(authUrl).subscribe((res)=>{
      if(res.url) {
        window.open(res.url)
      }
    })

  }
}
