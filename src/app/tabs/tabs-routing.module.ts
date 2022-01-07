import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'mall',
        loadChildren: () => import('../page/mall/mall.module').then(m => m.MallPageModule)
      },
      {
        path: 'cart',
        loadChildren: () => import('../page/cart/cart.module').then(m => m.CartPageModule)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('../page/dashboard/dashboard.module').then(m => m.DashboardPageModule)
      },
      {
        path: 'account',
        loadChildren: () => import('../page/account/account.module').then(m => m.AccountPageModule)
      },
      {
        path: 'category',
        loadChildren: () => import('../page/category/category.module').then( m => m.CategoryPageModule)
      },
      {
        path: 'search',
        loadChildren: () => import('../page/search/search.module').then( m => m.SearchPageModule)
      },
      {
        path: 'productdetail',
        loadChildren: () => import('../page/productdetail/productdetail.module').then( m => m.ProductdetailPageModule)
      },
      {
        path: 'geolocation',
        loadChildren: () => import('../page/geolocation/geolocation.module').then( m => m.GeolocationPageModule)
      },
      {
        path: 'camera',
        loadChildren: () => import('../page/camera/camera.module').then( m => m.CameraPageModule)
      }
    ]
  },
  {
    path: '',
    redirectTo: 'tabs/account',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
