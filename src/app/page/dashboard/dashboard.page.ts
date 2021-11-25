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

    expenses: Expense[];

    subscription: SubscriptionLike;
    installDate: Date;
    selectedDate: Date;
    dateSubscription: SubscriptionLike;

    todayDate: Date;

    expenseTypes: any;
    selectedType: string;

    totalSubscription: SubscriptionLike;
    todayTotal: number;

    filterByPrice: boolean;
    filterByPriceUp: boolean;

    userCredsSubscription: SubscriptionLike;

    constructor(
        private modalController: ModalController,
        private datetimeService: DatetimeService,
        private actionSheetController: ActionSheetController,
        private expenseService: ExpenseService
    ) {
        this.installDate = this.datetimeService.getInstallDate();
        this.todayDate = this.datetimeService.getCurrentDateTime();
        this.expenseTypes = ExpenseTypes;
        this.selectedType = ExpenseTypes.All.toString();
        this.todayTotal = null;
        this.selectedDate = new Date();
    }

    ngOnInit() {
        this.totalSubscription = this.expenseService.getTodayTotalSubscription()
            .subscribe({
                next: (total: number) => {
                    this.todayTotal = total;
                },
                error: (err) => {
                    console.log(err);
                },
                complete: () => {
                }
            });

        this.dateSubscription = this.datetimeService.getSelectedDateSubscription()
            .subscribe({
                next: (date: Date) => {
                    this.selectedDate = date;
                    console.log(date);
                },
                error: (err) => {
                    console.log(err);
                },
                complete: () => {
                }
            });
        this.subscription = this.expenseService.getExpensesSubscription()
            .subscribe({
                next: (expense: Expense[]) => {
                    if (expense != null) {
                        this.expenses = expense;
                    } else {
                        this.expenses = [];
                    }
                },
                error: (err) => {
                    console.log(err);
                },
            });
    }

    async presentModal() {
        const modal = await this.modalController.create({
            component: AddExpenseComponent
        });
        return await modal.present();
    }

    ngOnDestroy(): void {
    }

    changeSelectedDate(value: string): void {
        this.selectedDate = this.datetimeService.createDateFromString(value);
        this.datetimeService.setSelectedDate(value);
        this.expenseService.emitExpensesByDateFromLocal(this.selectedDate);
    }

    setCurrentToTodayDate(): void {
        this.datetimeService.setSelectedDate(this.datetimeService.getCurrentDateTime());
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
