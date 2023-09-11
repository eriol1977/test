import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DBTesterPage } from './dbtester.page';

const routes: Routes = [
  {
    path: '',
    component: DBTesterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DBTesterPageRoutingModule {}
