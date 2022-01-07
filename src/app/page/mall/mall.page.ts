import { DatetimeService } from './../../service/datetime.service';
import { delay, map, mergeAll, switchMap, take, tap, mergeMap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Animation,AnimationController, ModalController } from '@ionic/angular';
import { combineLatest, interval, merge, Observable, of } from 'rxjs';
import { ProductService } from 'src/app/service/product.service';
import { CartPage } from '../cart/cart.page';

@Component({
  selector: 'app-mall',
  templateUrl: './mall.page.html',
  styleUrls: ['./mall.page.scss'],
})
export class MallPage implements OnInit,AfterViewInit{

  @ViewChild('myfab', { read: ElementRef }) carBtn: ElementRef;
  products: any[];
  cart = {};
  cartAnimation: Animation;
  page = 1;
  pageSize = 10;

  slideOpts = {
    initialSlide: 1,
    speed: 400,
    loop: true,
    autoplay: true
  };

  slideList=[];
  qulityList=[];
  recommendationList=[];
  qulityListWidth='';


  constructor(private productService: ProductService,
              private animationCtrl: AnimationController,
              private modalCtrl: ModalController,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private datetimeService: DatetimeService) {

              }

  ngOnInit() {

    combineLatest([
      this.productService.getProduct(1,this.page,this.pageSize),
      this.productService.getProduct(2,this.page,this.pageSize),
      this.productService.getProduct(3,this.page,this.pageSize)
    ]).pipe(
      tap(([x,y,z])=>{
        this.slideList = x.content;
        this.qulityList = y.content;
        this.qulityListWidth=y.content.length*110+'px';
        this.recommendationList = z.content;
      })
    ).subscribe();


    // const source = interval(1000).pipe(
    //   tap(x=>console.log('SOURCE',this.datetimeService.getDateTimeISOWithFormat(null,'LTS'),x)
    //   ),
    //   take(5));

    // const source1 = of(1, 2, 3);
    // const myPromise = val =>
    //  new Promise(resolve => setTimeout(() => resolve(`Result: ${val}`), 2000));

    // const example = source
    //   .pipe(
    //     switchMap(val => of(val * 10))
    //   )
    //   .subscribe(val => console.log(this.datetimeService.getDateTimeISOWithFormat(null,'LTS'),val));

    // this.productService.getProduct(1,this.page,this.pageSize).subscribe(result => this.slideList = result.content);

    // this.productService.getProduct(2,this.page,this.pageSize).subscribe(
    //   result => {
    //              this.qulityList = result.content;
    //              this.qulityListWidth=result.content.length*110+'px';}
    //              );

    // this.productService.getProduct(3,this.page,this.pageSize).subscribe(result => this.recommendationList = result.content);

  }

  ngAfterViewInit() {
    // Setup an animation that we can reuse
    this.cartAnimation = this.animationCtrl.create('cart-animation');
    this.cartAnimation
    // .addElement(this.carBtn.nativeElement)
    .keyframes([
      { offset: 0, transform: 'scale(1)' },
      { offset: 0.5, transform: 'scale(1.2)' },
      { offset: 0.8, transform: 'scale(0.9)' },
      { offset: 1, transform: 'scale(1)' }
    ])
    .duration(300)
    .easing('ease-out');
  }

  addToCart(event, product) {
    event.stopPropagation();
    this.productService.addToCart(product.id);
    this.cartAnimation.play();
  }

  removeFromCart(event, product) {
    event.stopPropagation();
    this.productService.removeFromCart(product.id);
    this.cartAnimation.play();
  }

  // async openCart() {
  //   const modal = await this.modalCtrl.create({
  //     component: CartPage
  //   });
  //   await modal.present();
  // }

  searchItem(event){

    console.log(event.target);

    console.log(event.target.value.toLowerCase());
  }

  ionFocusEvent(event){

    console.log(event);
    this.router.navigate(['../search',{id:1,name:'taibei'}], {relativeTo: this.activatedRoute});

  }

  toDetailPage(item){

    console.log(item);
    this.router.navigate(['../productdetail',item], {relativeTo: this.activatedRoute});
  }

}
