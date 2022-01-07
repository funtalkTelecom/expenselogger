import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MallPage } from './mall.page';

const routes: Routes = [
  {
    path: '',
    component: MallPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MallPageRoutingModule {}
