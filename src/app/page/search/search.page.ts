import { ProductService } from 'src/app/service/product.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { IonInfiniteScroll,IonContent, AlertController  } from '@ionic/angular';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  searchKey='';
  searchList=[];
  searchListWidth='';
  searchFlag=false;

  hotKeyList=[];
  searchHistoryList=[];
  page = 1;
  pageSize = 10;
  lastPage=false;
  hiddenNoMore=false;

  // eslint-disable-next-line @typescript-eslint/member-ordering
  @ViewChild(IonContent) ionContent: IonContent ;
  constructor(private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    public alertController: AlertController) {

   }

  ngOnInit() {

    this.activatedRoute.paramMap.pipe(
      switchMap((params: ParamMap) => {
         console.log(params.get('id'));
         return of(null);
        }
       )).subscribe();


       this.initializeData();
  }

  initializeData(){

    this.productService.getHotKey(1,10).subscribe(
      result => this.hotKeyList= result.content
    );

    this.productService.getSearchLog(1,15).subscribe(
      result => this.searchHistoryList= result.content
    );

  }

  searchItem(event?){

    if(this.searchKey===''){
      console.log('search key is null');
      return;
    }

    if(!event){
      this.page=1;
      this.lastPage=false;
      this.ionContent.scrollToTop(50);
    }

    this.productService.searchProduct(this.searchKey,this.page,this.pageSize).subscribe(
              result =>{
                if (result != null) {
                  this.searchFlag=true;
                  if(event){
                    this.searchList = this.searchList.concat(result.content);
                    if(result.last===true){
                      this.lastPage=result.last;
                      event.target.enabled=true;
                    }
                  }else{
                    this.searchList = result.content;
                  }

              }});
  }

  loadMoreSearch(event){

    if(this.lastPage){
      this.hiddenNoMore=false;
      setTimeout(()=>{this.hiddenNoMore=true;},3000);
    }else{
      this.page++;
      this.searchItem(event);
    }
    event.target.complete();


  }

  goTosearchItem(itemName){
    this.searchKey=itemName;
    this.searchItem();
  }

  async removeSearchKey(searchKey){

    const alert = await this.alertController.create({
      header: 'Confirm',
      message: 'do you want to remove the item ?',
      buttons: [
        {
          text: 'Cancel'
        }, {
          text: 'Okay',
          handler: () => {
            this.productService.removeSearchKey(searchKey).subscribe(
              next=>{ this.searchHistoryList.splice(this.searchHistoryList.indexOf(searchKey),1); }
            );
          }
        }
      ]
    });

    await alert.present();

  }

}
