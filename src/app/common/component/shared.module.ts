import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule} from '@ionic/angular';
import { ReactiveFormsModule} from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AddExpenseComponent } from './add-expense/add-expense.component';
import { ProfilePhotoOptionComponent } from './profile-photo-option/profile-photo-option.component';


@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule
  ],
  declarations: [AddExpenseComponent,ProfilePhotoOptionComponent]
})
export class SharedModule { }
