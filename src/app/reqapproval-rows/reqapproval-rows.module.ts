import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { REQApprovalRowsPageRoutingModule } from './reqapproval-rows-routing.module';

import { REQApprovalRowsPage } from './reqapproval-rows.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    REQApprovalRowsPageRoutingModule
  ],
  declarations: [REQApprovalRowsPage]
})
export class REQApprovalRowsPageModule {}
