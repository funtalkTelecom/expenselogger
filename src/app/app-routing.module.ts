import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  {
    path: 'tabs',
    // canActivate: [AuthGuard],
    canLoad:[AuthGuard],
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  // {
  //   path: 'login',
  //   loadChildren: () => import('./page/login/login.module').then( m => m.LoginPageModule)
  // },
  {
    path: 'register',
    loadChildren: () => import('./page/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'forgetpassword',
    loadChildren: () => import('./page/forgetpassword/forgetpassword.module').then( m => m.ForgetpasswordPageModule)
  },
  {
    path: 'introduction',
    loadChildren: () => import('./page/auth/introduction/introduction.module').then( m => m.IntroductionPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./page/auth/login/login.module').then( m => m.LoginPageModule)
  },
  { path: '**', redirectTo: 'login',pathMatch: 'full'}

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
