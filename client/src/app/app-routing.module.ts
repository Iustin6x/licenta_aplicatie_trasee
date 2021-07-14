import { AuthGuard } from './guards/auth.guard';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AutoLoginGuard } from './guards/auto-login.guard';
const routes: Routes = [
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tab-bar/tab-bar.module').then( m => m.TabBarPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
    canLoad: [AutoLoginGuard] // Check if we should show the introduction or forward to inside

  },
  {
    path: 'register',
    loadChildren: () => import('./pages/register/register.module').then( m => m.RegisterPageModule),
    canLoad: [AutoLoginGuard]
  },
  {
    path: 'user',
    loadChildren: () => import('./pages/board-user/board-user.module').then( m => m.BoardUserPageModule)
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  }



];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
