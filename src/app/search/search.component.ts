import { product } from './../data-type';
import { ProductService } from './../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchResult:undefined| product[]
  constructor(private activeRoute:ActivatedRoute, private product:ProductService) { }

  ngOnInit(): void {
    let query=this.activeRoute.snapshot.paramMap.get('query');
    console.log(query);
    query && this.product.searchProduct(query).subscribe((result)=>{
      console.log(result);
      this.searchResult=result;
    })
     
  }

}
