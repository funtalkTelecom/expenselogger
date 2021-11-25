import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Expense} from '../interface/expense';
import { LocalStoreService } from './localstore.service';
import { DatetimeService } from './datetime.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ExpenseService {

    apiUrl = environment.apiUrl;
    private readonly expenses: BehaviorSubject<Expense[]>;
    private readonly todayTotalExpense: BehaviorSubject<number>;

    constructor(
      private http: HttpClient,
      private datetimeService: DatetimeService,
      private storageService: LocalStoreService,
      ) {
        this.expenses = new BehaviorSubject<Expense[]>(null);
        this.todayTotalExpense = new BehaviorSubject<number>(0);
    }

    getTodayTotalSubscription(): BehaviorSubject<number> {
      return this.todayTotalExpense;
  }

  async setTodayTotalExpense(total: number): Promise<void> {
      return this.todayTotalExpense.next(total);
  }

  async getExpenses(): Promise<Expense[]> {
      return this.expenses.getValue();
  }

  async setExpenses(expenses: Expense[]): Promise<void> {
      if (expenses) {
          this.setTodayTotalExpense(this.calculateTodayTotal(expenses));
      }
      return this.expenses.next(expenses);
  }

    getExpensesSubscription(): BehaviorSubject<Expense[]> {
        return this.expenses;
    }


    calculateTodayTotal(expenses: Expense[]): number {
        let total = 0;
        for (const expense of expenses) {
            total += expense.amount;
        }
        return total;
    }

    addExpense(expense: Expense): Observable<any> {
      expense.createTime=this.datetimeService.getCurrentDateTime();
      console.log(expense);
      return this.http.post(`${this.apiUrl}/createExpense`, expense);
  }


  async getTodayExpensesFromLocal(): Promise<void> {
      return this.getExpensesFromLocal().then((expenses: Expense[]) => {
          this.setExpenses(expenses);
      });
  }

  async emitExpensesByDateFromLocal(date: Date): Promise<void> {
       return this.getExpensesFromLocal(date).then((expenses) => {
          this.setExpenses(expenses);
      });
  }

  async saveExpenseToLocal(expense: Expense): Promise<void> {
      const key = this.datetimeService.getDateTimeISOWithFormat(expense.createTime);
      let expensesList: Expense[] = [];
      return this.storageService.getFromLocalStorage(key).then((expenses: Expense[]) => {
          if (expenses == null) {
              expensesList.push(expense);
          } else {
              expensesList = expenses;
              expensesList.push(expense);
          }
      }).then(() => {
          this.storageService.saveToLocalStorage(key, expensesList).then(() => {
              this.setExpenses(expensesList);
          });
      }).catch((err) => console.log(err));
  }

  async getExpensesFromLocal(date?: Date): Promise<Expense[]> {
      const key = date ? this.datetimeService.getDateTimeISOWithFormat(date) : this.datetimeService.getDateTimeISOWithFormat();
      return await this.storageService.getFromLocalStorage(key).then((expenses: Expense[]) => expenses );
  }

}
