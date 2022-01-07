import { element } from 'protractor';
import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {

  carts=[];
  page = 1;
  pageSize = 10;

  amount=0;

  constructor(private productService: ProductService,
              private modalCtrl: ModalController,
              private alertCtrl: AlertController) { }

  ngOnInit() {

    // this.productService.getProducts().pipe(take(1)).subscribe(allProducts => {
    //   this.products = allProducts.filter(p => cartItems[p.id]).map(product => {
    //     return { ...product, count: cartItems[product.id] };
    //   });
    // });


    for(let i=0;i<20;i++)
    {this.carts.push({
      pic:'https://www.europarl.europa.eu/resources/library/images/20160609PHT31661/20160609PHT31661_original.jpg',
      title:' product '+i+' with hight quality',
      price:100
    });}
   this.productService.getCartByConsumerId(this.page,this.pageSize).subscribe(
     result =>{ this.carts= result.content;}
   );

  }

  async checkout() {
    const alert = await this.alertCtrl.create({
      header: 'Success',
      message: 'Thanks for your order',
      buttons: ['Continue shopping']
    });

    await alert.present();

    this.productService.checkoutCart();
    this.modalCtrl.dismiss();
  }

  close() {
    this.modalCtrl.dismiss();
  }

  increaseAmount(event,_element){

  }

  decreaseAmount(event,_element){

  }
}
