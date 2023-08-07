import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewWorkRequestPage } from './new-work-request.page';

const routes: Routes = [
  {
    path: '',
    component: NewWorkRequestPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewWorkRequestPageRoutingModule {}
