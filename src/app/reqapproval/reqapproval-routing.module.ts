import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { REQApprovalPage } from './reqapproval.page';

const routes: Routes = [
  {
    path: '',
    component: REQApprovalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class REQApprovalPageRoutingModule {}
