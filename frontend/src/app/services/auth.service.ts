import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  getAuth() {
    let authUrl = "http://localhost:3000/authorization/ayush.ashu01@gmail.com";
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

  getTeamAuth() {
    let authUrl = "http://localhost:3000/signin/ayush@msleadangel.com";
    this.http.get<any>(authUrl).subscribe((res) => {
      console.log("res", res)
      if (res.authUrl) {
        window.open(res.authUrl);
      } else {
        console.log("first")
        this.router.navigate(
          ["/validate-team-auth"], 
          { queryParams: { access_token: res.access_token }, queryParamsHandling: 'merge', skipLocationChange: true}
          );
      }
    });
  }
}
