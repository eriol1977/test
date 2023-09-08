import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorkRequestsPage } from './work-requests.page';

const routes: Routes = [
  {
    path: '',
    component: WorkRequestsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkRequestsPageRoutingModule {}
