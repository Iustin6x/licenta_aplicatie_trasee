import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabBarPage } from './tab-bar.page';

const routes: Routes = [
  {
    path: '',
    component: TabBarPage,
    children: [
      {
        path: 'profile',
        children: [
          {
            path: ':username',
            loadChildren: () =>
            import('../profile/profile.module').then(m => m.ProfilePageModule)
          },
          {
            path: 'edit/:username',
            loadChildren: () =>
              import('../profile-edit/profile-edit.module').then(m => m.ProfileEditPageModule)
          },
          {
            path: 'edit/',
            loadChildren: () =>
              import('../profile-edit/profile-edit.module').then(m => m.ProfileEditPageModule)
          },
          {
            path: '',
            loadChildren: () =>
              import('../profile/profile.module').then(m => m.ProfilePageModule)
          }
        ]
      },
      {
        path: 'friends',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../friends/friends.module').then(m => m.FriendsPageModule)
          }
        ]
      },
      {
        path: 'maps',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../maps/maps.module').then(m => m.MapsPageModule)
          }
        ]
      },
      {
        path: 'record',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../record/record.module').then(m => m.RecordPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/maps',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/maps',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabBarPageRoutingModule {}

