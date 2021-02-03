import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('@summoners-app/modules/home/home.module').then( home => home.HomeModule)
  },
  {
    path: 'management',
    loadChildren: () => import("@summoners-app/modules/management/management.module").then(management => management.ManagementModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
