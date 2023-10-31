import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full',
  },
  {
    path: 'work-request/new-work-request',
    loadChildren: () =>
      import('./work-request/new-work-request/new-work-request.module').then(
        (m) => m.NewWorkRequestPagePageModule
      ),
  },
  {
    path: 'work-request/edit-work-request/:id',
    loadChildren: () =>
      import('./work-request/new-work-request/new-work-request.module').then(
        (m) => m.NewWorkRequestPagePageModule
      ),
  },
  {
    path: 'work-request/work-requests',
    loadChildren: () =>
      import('./work-request/work-requests/work-requests.module').then(
        (m) => m.WorkRequestsPageModule
      ),
  },
  {
    path: 'landing',
    loadChildren: () =>
      import('./landing/landing.module').then((m) => m.LandingPageModule),
  },
  {
    path: 'dbtester',
    loadChildren: () =>
      import('./dbtester/dbtester.module').then((m) => m.DBTesterPageModule),
  },
  {
    path: 'wstester',
    loadChildren: () =>
      import('./wstester/wstester.module').then((m) => m.WSTesterPageModule),
  },
  {
    path: 'reqapproval',
    loadChildren: () =>
      import('./reqapproval/reqapproval.module').then(
        (m) => m.REQApprovalPageModule
      ),
  },
  {
    path: 'reqapproval-rows/:id',
    loadChildren: () =>
      import('./reqapproval-rows/reqapproval-rows.module').then(
        (m) => m.REQApprovalRowsPageModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
