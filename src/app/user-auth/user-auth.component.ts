import { ProductService } from './../services/product.service';
import { signUp, login, product, cart } from './../data-type';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-auth',
  templateUrl: './user-auth.component.html',
  styleUrls: ['./user-auth.component.css']
})
export class UserAuthComponent implements OnInit {
  authError:string="";
  constructor(private user:UserService,private product:ProductService) { }
  showLogin:boolean=true;
  ngOnInit(): void {
    this.user.userAuthReload();
  }
  signUp(data:signUp){
    this.user.userSignUp(data)
  }
  login(data:login){
    this.user.userLogin(data);
    this.user.inValidUserAuth.subscribe((result)=>{
      if(result){
        this.authError="User not Found"
      }else{
        setTimeout(()=>{
          this.localCartToRemoteCart()
        },300)
      }
    })
  }
  openLogin(){
    this.showLogin=true;
  }
  openSignUp(){
    this.showLogin=false;
  }
  localCartToRemoteCart(){
    let data=localStorage.getItem('localCart');
    let user=localStorage.getItem('user');
    let userId= user && JSON.parse(user).id;
    if(data){
      let cartDataList:product[]=JSON.parse(data);

      

      cartDataList.forEach((product:product,index)=>{
        let cartData:cart={
          ...product,
          productId:product.id,
          userId,
        };

        delete cartData.id;
        setTimeout(()=>{
          this.product.addToCart(cartData).subscribe((result)=>{
            if(result){
              console.log("Item stored in DB");
            }
          })
          if(cartDataList.length===index+1){
            localStorage.removeItem('localCart');
          }
        },5000)
        
      })

    }

  setTimeout(()=>{
  this.product.getCartList(userId);
  },2000);

  }


}
