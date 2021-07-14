import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BoardUserPageRoutingModule } from './board-user-routing.module';

import { BoardUserPage } from './board-user.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BoardUserPageRoutingModule
  ],
  declarations: [BoardUserPage]
})
export class BoardUserPageModule {}
