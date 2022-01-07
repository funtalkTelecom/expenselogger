import { log } from 'console';
import { User, Role } from './../interface/user';
import { switchMap, mergeMap, tap, toArray, map, mergeAll, delay, concatMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LocalStoreService } from './localstore.service';

const CART_STORAGE_KEY = 'MY_CART';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  apiUrl = environment.apiUrl;
  cart = new BehaviorSubject({});
  cartKey = null;
  constructor(private http: HttpClient,
              private storageService: LocalStoreService,
              private authService: AuthService
    ) { }

  getProduct(areaType: number,page: number, pageSize: number): Observable<any> {

    // const getData = (param) => of(`retrieved new data with param ${param}`).pipe(
    //     tap(x=>console.log(new Date(),'-------',x)),
    //     delay(3000)
    //   );
    // from([1,2,3,4]).pipe(
    //   switchMap(param => getData(areaType+''+param)),
    //   // mergeMap(param => getData(areaType+''+param)),
    //   // concatMap(param => getData(areaType+''+param)),
    //   // mergeAll()
    // ).subscribe(val => console.log(new Date(),'-------',val));

    // if(areaType===3){
    //   this.http.get(`${this.apiUrl}/getuserbyname/王新谱`).pipe(
    //     switchMap((x: User) =>
    //                from(x.roles).pipe(
    //                    tap(_x=> console.log('-------------------'+ JSON.stringify(_x))),
    //                    switchMap((role: Role)=>
    //                       this.http.get(`${this.apiUrl}/getrole/${role.id}`)),
    //                   // toArray()
    //     ))
    //   ).subscribe(x=>console.log('==========='+ JSON.stringify(x) ));

    // }

    return this.http.get(`${this.apiUrl}/getProduct/${areaType}/${page}/${pageSize}`);


  }

  getCartByConsumerId(page: number, pageSize: number): Observable<any> {

    const consumerId = this.authService.consumerId;
    if(consumerId){
      return this.http.get(`${this.apiUrl}/getCartByConsumerId/${consumerId}/${page}/${pageSize}`);
    }else{
          this.authService.toLoginPage();
    }
  }

  async loadCart() {

    const consumerId = this.authService.consumerId;
    if (consumerId) {
        this.http.get(`${this.apiUrl}/getCartByConsumerId/${consumerId}`).subscribe(
           cart=>{this.cart.next(cart||{}); }
      );
    }
  }

  addToCart(productId) {

    const consumerId = this.authService.consumerId;
    if (consumerId) {
        this.http.get(`${this.apiUrl}/addCart/${consumerId}/${productId}`).subscribe();
    }
  }

  removeFromCart(productId) {

    const consumerId = this.authService.consumerId;
    if (consumerId) {
        this.http.get(`${this.apiUrl}/deleteCart/${consumerId}/${productId}`).subscribe();
    }
  }

  removeSearchKey(searchKey): Observable<any>{
    return this.http.get(`${this.apiUrl}/deleteSearchKey/${searchKey}`);
  }

  async checkoutCart() {
    // Create an order
    // Clear old cart
  }

  getHotKey(page: number, pageSize: number): Observable<any>{

    return this.http.get(`${this.apiUrl}/getHotKey/${page}/${pageSize}`);

  }

  getSearchLog(page: number, pageSize: number): Observable<any>{

      return this.http.get(`${this.apiUrl}/getSearchLog/${page}/${pageSize}`);

  }

  searchProduct(keyWord: string,page: number, pageSize: number): Observable<any>{

   return this.http.get(`${this.apiUrl}/getProductByProductName/${keyWord}/${page}/${pageSize}`);
  }

}
