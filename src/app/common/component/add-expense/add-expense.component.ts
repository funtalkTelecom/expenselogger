import { Router } from '@angular/router';
import {Component, Input, OnInit} from '@angular/core';
import {AlertController, ModalController, ToastController,NavController} from '@ionic/angular';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Expense} from '../../../interface/expense';
import {DatetimeService} from '../../../service/datetime.service';
import {ExpenseTypes} from '../../constant';
import {ExpenseService} from '../../../service/expense.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import * as moment from 'moment';
import { Utils } from '../../utils';

@Component({
	selector: 'app-add-expense',
	templateUrl: './add-expense.component.html',
	styleUrls: ['./add-expense.component.scss'],
})
export class AddExpenseComponent implements OnInit {

  @Input() user: string;

	expenseForm: Expense;
	expenseTypes: any;

	addExpenseForm = new FormGroup({
    expenseDate: new FormControl('', Validators.required),
		amount: new FormControl('', Validators.required),
		description: new FormControl(''),
		expenseType: new FormControl('', Validators.required),
	});

	constructor(
		private modalController: ModalController,
		private dateTimeService: DatetimeService,
		private expenseService: ExpenseService,
		private toastController: ToastController,
		private router: Router,
		private navController: NavController

	) {
		this.expenseTypes = ExpenseTypes;

	}

	ngOnInit() {
    console.log(this.user);

	}

	addExpense(): void {


		const expense = this.addExpenseForm.value;
		expense.amount = Number(expense.amount.toFixed(2));
    // get yyyy-mm-dd
    expense.expenseDate=expense.expenseDate.substring(0,10);

    this.expenseService.addExpense(expense).subscribe(
      async _ => {
        const toast = await this.toastController.create({
            message: 'add successfully!',
            duration: 1000,
            position: 'top',
            color:'success'
        });
        toast.present();
      }
    );
	}

	dismissModal(): void {
		this.modalController.dismiss('2').then().catch();
	}
}
