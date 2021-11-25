import { Router } from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {AlertController, ModalController, ToastController} from '@ionic/angular';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Expense} from '../../../interface/expense';
import {DatetimeService} from '../../../service/datetime.service';
import {ExpenseTypes} from '../../constant';
import {ExpenseService} from '../../../service/expense.service';

@Component({
	selector: 'app-add-expense',
	templateUrl: './add-expense.component.html',
	styleUrls: ['./add-expense.component.scss'],
})
export class AddExpenseComponent implements OnInit {


	expenseForm: Expense;
	expenseTypes: any;


	addExpenseForm = new FormGroup({
    expenseDate: new FormControl('', Validators.required),
		amount: new FormControl('', Validators.required),
		description: new FormControl(''),
		type: new FormControl('', Validators.required),
	});

	constructor(
		private modalController: ModalController,
		private dateTimeService: DatetimeService,
		private expenseService: ExpenseService,
    private toastController: ToastController,
    private router: Router

	) {
		this.expenseTypes = ExpenseTypes;
	}

	ngOnInit() {
	}

	addExpense(): void {

		const expense = this.addExpenseForm.value;
		expense.amount = Number(expense.amount.toFixed(2));

    this.expenseService.addExpense(expense).subscribe(
      async _ => {
        const toast = await this.toastController.create({
            message: 'add successfully.',
            duration: 2000
        });
        toast.present();
      }
    );
	}

	dismissModal(): void {
		this.modalController.dismiss().then().catch();
	}
}
