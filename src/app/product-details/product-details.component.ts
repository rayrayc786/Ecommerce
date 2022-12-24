import { product, cart } from './../data-type';
import { ProductService } from './../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  constructor(private activateRoute:ActivatedRoute, private product:ProductService) { }
  productData:undefined|product;
  productQuantity:number=1;
  quantity:number=1;
  removeCart=false;
  cartData:product|undefined;
  ngOnInit(): void {
    let productId=this.activateRoute.snapshot.paramMap.get('productId');
    console.log(productId);
    productId && this.product.getProduct(productId).subscribe((result)=>{
      this.productData=result;

      let cartData=localStorage.getItem('localCart');
      if(productId && cartData){
        let items=JSON.parse(cartData);
        items=items.filter((item:product)=>productId== item.id.toString())
        if(items.length){
          this.removeCart=true;
        }else{
          this.removeCart=false;
        }
      }
      let user= localStorage.getItem('user');
      if(user){
        let userId=user && JSON.parse(user).id;
        this.product.getCartList(userId);
        this.product.cartData.subscribe((result)=>{
          let item=result.filter((item:product)=>productId?.toString()===item.productId?.toString());
          if(item.length){
            this.cartData=item[0];
            this.removeCart=true
          }
        })
      }
    })
  }
  handleQuantity(val:string){
    console.log('first')
    if(this.productQuantity<20 && val==='plus'){
      this.productQuantity+=1;
    }else if(this.productQuantity>1 && val==='min'){
      this.productQuantity-=1;
    }
  }
  AddToCart(){
    if(this.productData){
      this.productData.quantity=this.productQuantity;
      if(!localStorage.getItem('user')){
        this.product.localAddToCart(this.productData);
        this.removeCart=true;
      }else{
        let user= localStorage.getItem('user');
        let userId=user && JSON.parse(user).id;
        console.log(userId);
        let cartData:cart={
          ...this.productData,
          userId,
          productId:this.productData.id
        }
        delete cartData.id;
        console.log(cartData);
        this.product.addToCart(cartData).subscribe((result)=>{
          if(result){
            alert("product is added in cart")
          }
          this.product.getCartList(userId);
          this.removeCart=true;
        })
      }
    }
  }
  removeToCart(productId:number){
    if(!localStorage.getItem('user')){
      this.product.removeItemFromCart(productId);
      this.removeCart=false;
    }else{
      let user= localStorage.getItem('user');
        let userId=user && JSON.parse(user).id;
      console.log(this.cartData);
      this.cartData && this.product.removeToCart(this.cartData?.id).subscribe((result)=>{
        if(result){
          this.product.getCartList(userId);
        }
      })
    }
    this.removeCart=false;
    
  }

}
