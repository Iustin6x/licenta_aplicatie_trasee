import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BoardUserPage } from './board-user.page';

const routes: Routes = [
  {
    path: '',
    component: BoardUserPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BoardUserPageRoutingModule {}
