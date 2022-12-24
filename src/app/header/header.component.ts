import { product } from './../data-type';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  menuType:String='default';
  sellerName:string='';
  searchResult:undefined|product[];
  searchMessage:undefined|string;
  userName:string="";
  cartItems=0;
  constructor(private router:Router, private product:ProductService) { }

  ngOnInit(): void {
    this.router.events.subscribe((val:any)=>{
      if(val.url){
        if(localStorage.getItem('seller')&& val.url.includes('seller')){
          if(localStorage.getItem('seller')){
            let sellerStore=localStorage.getItem('seller');
            let sellerData=sellerStore &&  JSON.parse(sellerStore)[0];
            this.sellerName=sellerData.name;
          this.menuType="seller";

          }
        }else if(localStorage.getItem('user')){
          let userStore=localStorage.getItem('user');
          let userData=userStore && JSON.parse(userStore);
          this.userName=userData.name;
          this.menuType='user';
          this.product.getCartList(userData.id);

        }else{
          console.log('outside seller area');
          this.menuType="default"
        }
      }
    })

    let cartData=localStorage.getItem('localCart');
    if(cartData){
      this.cartItems=JSON.parse(cartData).length;
    }

    this.product.cartData.subscribe((items)=>{
      this.cartItems=items.length;
    })
  }
  logout(){
    localStorage.removeItem('seller');
    this.router.navigate(['/']);
  }
  userLogout(){
    localStorage.removeItem('user');
    this.router.navigate(['/user-auth']);
    this.product.cartData.emit([]);
  }
  searchProduct(query:KeyboardEvent){
    if(query){
      const element= query.target as HTMLInputElement;
      this.product.searchProduct(element.value).subscribe((result)=>{
        if(result.length==0){
          this.searchMessage='No item found';
        }
        if(result.length>5){
          result.length=5;
        }
        
        this.searchResult=result;
      })
    }
  }
  hideSearch(){
    this.searchResult=undefined;
  }
  submitSearch(val:string){
    this.router.navigate([`search/${val}`])
  }
  redirectToDetails(id:number){
    this.router.navigate(['/details/'+id])
  }

}
