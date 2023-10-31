import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { REQApprovalPageRoutingModule } from './reqapproval-routing.module';

import { REQApprovalPage } from './reqapproval.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    REQApprovalPageRoutingModule
  ],
  declarations: [REQApprovalPage]
})
export class REQApprovalPageModule {}
