import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'work-request/new-work-request',
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
    path: 'work-request/work-requests',
    loadChildren: () =>
      import('./work-request/work-requests/work-requests.module').then(
        (m) => m.WorkRequestsPageModule
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
