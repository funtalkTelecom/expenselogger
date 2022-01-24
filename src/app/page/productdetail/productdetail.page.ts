import { ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-productdetail',
  templateUrl: './productdetail.page.html',
  styleUrls: ['./productdetail.page.scss'],
})
export class ProductdetailPage implements OnInit {

  tabs='product';

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {

    // receive the param from method below :
    // this.router.navigate(['../productdetail',item], {relativeTo: this.activatedRoute})
      this.activatedRoute.paramMap.pipe(
      switchMap((params: ParamMap) => {
         console.log(params);
         return of(null);
        }
       )).subscribe();

    //receive the param from method below :
    // this.router.navigate(['../productdetail',item], {relativeTo: this.activatedRoute})
       console.log('-----productName------'+this.activatedRoute.snapshot.paramMap.get('productName'));

    //  receive the param from tag attributes below :  routerLink='../productdetail' [queryParams]="item"
    this.activatedRoute.queryParams.subscribe(
      res=>console.log(res.productName)
    );
  }

}
