import { Router } from '@angular/router';
import { signUp, login } from './../data-type';
import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  inValidUserAuth = new EventEmitter<boolean>(false);
  constructor(private http:HttpClient, private router:Router) { }
  userSignUp(user:signUp){
    this.http.post("http://localhost:3000/users",user,{observe:'response'})
    .subscribe((result)=>{
      console.log(result);
      if(result){
        localStorage.setItem('user',JSON.stringify(result.body))
        this.router.navigate(['/']);
      }
    })
    
  }
  userLogin(user:login){
    this.http.get<signUp[]>(`http://localhost:3000/users?email=${user.email}&password=${user.password}`,{observe:'response'}).subscribe((result)=>{
      if(result && result.body?.length){
        this.inValidUserAuth.emit(false);
        localStorage.setItem('user',JSON.stringify(result.body[0]))
        this.router.navigate(['/']);
      }else{
        this.inValidUserAuth.emit(true);
      }

    })

  }
  userAuthReload(){
    if(localStorage.getItem('user')){
      this.router.navigate(['/']);
    }
  }
}
