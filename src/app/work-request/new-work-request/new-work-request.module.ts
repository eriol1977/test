import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewWorkRequestPageRoutingModule } from './new-work-request-routing.module';

import { NewWorkRequestPage } from './new-work-request.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewWorkRequestPageRoutingModule,
  ],
  declarations: [NewWorkRequestPage],
})
export class NewWorkRequestPagePageModule {}
