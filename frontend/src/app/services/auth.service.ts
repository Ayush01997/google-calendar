import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  getAuth() {
    let authUrl = "http://localhost:3000/authorization/ayush.ashu01@gmail.coml";
    this.http.get<any>(authUrl).subscribe((res) => {
      if (res.url) {
        window.open(res.url);
      } else {
        console.log("first")
        this.router.navigate(
          ["/validate-auth"], 
          { queryParams: { access_token: res.access_token }, queryParamsHandling: 'merge', skipLocationChange: true}
          );
      }
    });
  }
}
