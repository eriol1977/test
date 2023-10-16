import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WSTesterPage } from './wstester.page';

const routes: Routes = [
  {
    path: '',
    component: WSTesterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WSTesterPageRoutingModule {}
