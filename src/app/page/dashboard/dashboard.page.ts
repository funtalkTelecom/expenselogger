import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {ActionSheetController, ModalController} from '@ionic/angular';
import {AddExpenseComponent} from '../../common/component/add-expense/add-expense.component';
import {ExpenseService} from '../../service/expense.service';
import {Expense} from '../../interface/expense';
import {SubscriptionLike} from 'rxjs';
import {DatetimeService} from '../../service/datetime.service';
import {ExpenseTypes} from '../../common/constant';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.page.html',
    styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit, OnDestroy, AfterViewInit {

    expenses: Expense[]=[];

    searchMonth='';
    lastPage=false;
    hiddenNoMore=true;
    monthAmount=0;


    subscription: SubscriptionLike;
    selectedDate: Date;
    dateSubscription: SubscriptionLike;

    expenseTypes: any;
    selectedType: string;

    totalSubscription: SubscriptionLike;
    todayTotal: number;

    filterByPrice: boolean;
    filterByPriceUp: boolean;

    userCredsSubscription: SubscriptionLike;

    page = 1;
    pageSize = 10;

    constructor(
        private modalController: ModalController,
        private datetimeService: DatetimeService,
        private actionSheetController: ActionSheetController,
        private expenseService: ExpenseService
    ) {
        this.searchMonth=this.datetimeService.getDateTimeISOWithFormat(new Date(),'YYYY-MM');
        this.expenseTypes = ExpenseTypes;
        this.selectedType = ExpenseTypes.All.toString();
        this.todayTotal = null;
        this.selectedDate = new Date();
    }

    ngOnInit() {
        // this.totalSubscription = this.expenseService.getTodayTotalSubscription()
        //     .subscribe({
        //         next: (total: number) => {
        //             this.todayTotal = total;
        //         },
        //         error: (err) => {
        //             console.log(err);
        //         },
        //         complete: () => {
        //         }
        //     });

        this.getSumAmountByDate();
        this.getExpenseByDate();

    }

    getSumAmountByDate(): void{

      this.expenseService.getSumAmountByDate(this.searchMonth).subscribe(
        {next:(monthAmount)=>{
          this.monthAmount=monthAmount;
        }}
      );

    }

    getExpenseByDate(event?): void{
      this.expenseService.getExpenseByDate(this.searchMonth,this.page,this.pageSize)
      .subscribe({
                    next: (expense) => {
                      console.log(expense);
                        if (expense != null) {
                            this.expenses = this.expenses.concat(expense.content);
                            if(expense.last===true){
                              this.hiddenNoMore=false;
                              this.lastPage=expense.last;
                              // event.target.disabled= true;
                            }
                        }
                    },
                    error: (err) => {
                        console.log(err);
                    }
      });

      if(event){
            event.target.complete();
      }

    }

    loadMore(event): void{

      if(this.lastPage){

        event.target.disabled= true;
        // event.target.complete();
        // this.hiddenNoMore=false;
        // setTimeout(()=>{this.hiddenNoMore=true;},3000);
      }else{
        this.page++;
        this.getExpenseByDate(event);
      }


    }

    async presentModal() {
        const modal = await this.modalController.create({
            component: AddExpenseComponent,
            componentProps: { user: '1' },
        });

        modal.onDidDismiss().then((data) => {
          console.log(data);
          this.expenses=[];
          this.ngOnInit();
        });

        return await modal.present();
    }

    ngOnDestroy(): void {
    }

    changeSelectedDate(value: string): void {
      this.searchMonth= value.substring(0,7);
      this.selectedDate = this.datetimeService.createDateFromString(value);
      this.expenses=[];
      this.getSumAmountByDate();
      this.getExpenseByDate();
        // this.datetimeService.setSelectedDate(value);
        // this.expenseService.emitExpensesByDateFromLocal(this.selectedDate);
    }


    changeSelectedValue(s: string): void {
        this.selectedType = s;
    }

    priceFilter(): void {
        this.expenses = this.expenses.sort((a, b) => {
            if (a.amount > b.amount) {
                return this.filterByPriceUp ? 1 : -1;
            }
            if (b.amount > a.amount) {
                return this.filterByPriceUp ? -1 : 1;
            }
            return 0;
        });
        this.filterByPrice = true;
        this.filterByPriceUp = !this.filterByPriceUp;
    }

    async presentFilterActionSheet() {
        const actionSheet = await this.actionSheetController.create({
            header: 'Albums',
            buttons: [
                {
                    text: 'Price',
                    icon: 'logo-usd',
                    handler: () => {
                        console.log('Share clicked');
                    }
                }, {
                    text: 'Recent',
                    icon: 'cellular-outline',
                    handler: () => {
                        console.log('Play clicked');
                    }
                }, {
                    text: 'Cancel',
                    icon: 'close',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }]
        });
        await actionSheet.present();
    }

    ngAfterViewInit(): void {
        // this.fireAuth.authState.subscribe((res) => {
        //     console.log(res);
        // });
        // this.userCredsSubscription = this.authService.getUserCredentialSubscription()
        //     .subscribe({
        //         next: (userCreds: UserCredential) => {
        //             // console.log(userCreds);
        //             this.userCreds = userCreds;
        //             // debugger
        //         },
        //         error: (err) => {
        //             console.log(err);
        //         }
        //     });

    }

}
