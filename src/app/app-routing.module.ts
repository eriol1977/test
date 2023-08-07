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
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
