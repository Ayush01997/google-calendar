import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '../common/shared.service';

@Component({
  selector: 'app-validate-auth',
  templateUrl: './validate-auth.component.html',
  styleUrls: ['./validate-auth.component.css']
})
export class ValidateAuthComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute, private http : HttpClient, private shared : SharedService) { }

  ngOnInit(): void {
    console.log("second")
   const access_token = this.route.snapshot.queryParamMap.get('access_token');
   console.log("access_token")
   if(access_token){
    this.http.post<any>(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`,{}).subscribe((res)=>{
      console.log(res)
      if(res.email){
        let data = {"name" : res.name , "email" : res.email }
        localStorage.setItem("userDetail", JSON.stringify(data))
        this.router.navigate(['setAvailability'])
      }else{
        this.router.navigate([''])
      }
    },(err) => {
      this.router.navigate(['/'])
    }) 
   }else{
    const id_token = this.route.snapshot.queryParamMap.get('id_token');
    console.log(id_token)
    this.http.post<any>(`https://oauth2.googleapis.com/tokeninfo?id_token=${id_token}`,{}).subscribe((res)=>{
      console.log(res)
      if(res.email){
        let data = {"name" : res.name , "email" : res.email }
        localStorage.setItem("userDetail", JSON.stringify(data))
        this.router.navigate(['setAvailability'])
      }else{
        this.router.navigate([''])
      }
    },(err) => {
      this.router.navigate(['/'])
    }) 
   }
    
  }

}
