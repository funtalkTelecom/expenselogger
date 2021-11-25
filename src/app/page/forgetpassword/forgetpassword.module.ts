import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { ForgetpasswordPageRoutingModule } from './forgetpassword-routing.module';

import { ForgetpasswordPage } from './forgetpassword.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ForgetpasswordPageRoutingModule
  ],
  declarations: [ForgetpasswordPage]
})
export class ForgetpasswordPageModule {}
