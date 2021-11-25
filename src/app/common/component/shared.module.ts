import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule} from '@ionic/angular';
import { ReactiveFormsModule} from '@angular/forms';
import { AddExpenseComponent } from './add-expense/add-expense.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule
  ],
  declarations: [AddExpenseComponent]
})
export class SharedModule { }
