import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MallPageRoutingModule } from './mall-routing.module';

import { MallPage } from './mall.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MallPageRoutingModule
  ],
  declarations: [MallPage]
})
export class MallPageModule {}
