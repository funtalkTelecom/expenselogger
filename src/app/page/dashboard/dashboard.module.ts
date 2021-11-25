import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../common/component/shared.module';
import { IonicModule } from '@ionic/angular';
import { DashboardPage } from './dashboard.page';
import {CatagoryPipe} from '../../common/catagory-pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild([{path:'',component:DashboardPage}])
  ],
  declarations: [DashboardPage,CatagoryPipe]
})
export class DashboardPageModule {}
