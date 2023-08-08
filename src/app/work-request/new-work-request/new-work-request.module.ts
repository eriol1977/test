import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewWorkRequestPageRoutingModule } from './new-work-request-routing.module';

import { NewWorkRequestPage } from './new-work-request.page';
import { SearchListModule } from 'src/app/search-list/search-list.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewWorkRequestPageRoutingModule,
    SearchListModule,
  ],
  declarations: [NewWorkRequestPage],
})
export class NewWorkRequestPagePageModule {}
