import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManagementComponent } from './management.component';
import { AddChampionShip } from './pages/add/add-championship';
import { SearchChampionShip } from './pages/search/search-championship';


const routes: Routes = [
  {
    path: '',
    component: ManagementComponent,
    children: [
      {
        path: '', redirectTo: 'search', pathMatch: 'full'
      },
      {
        path: 'search',
        component: SearchChampionShip
      },
      {
        path: 'add',
        component: AddChampionShip
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementRoutingModule { }
