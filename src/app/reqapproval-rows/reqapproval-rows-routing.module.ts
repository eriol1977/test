import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { REQApprovalRowsPage } from './reqapproval-rows.page';

const routes: Routes = [
  {
    path: '',
    component: REQApprovalRowsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class REQApprovalRowsPageRoutingModule {}
