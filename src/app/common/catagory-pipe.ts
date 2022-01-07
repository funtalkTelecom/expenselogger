import {Pipe, PipeTransform} from '@angular/core';
import {Expense} from '../interface/expense';

@Pipe({
	name: 'catagory'
})
export class CatagoryPipe implements PipeTransform {

	transform(value: Expense[], type: string): any {
		if (type === 'All' || type === undefined) {
			return value;
		} else {
			return value.filter(val => val.expenseType === type);
		}
	}
}
