import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManagementRoutingModule } from './management-routing.module';
import { ManagementComponent } from './management.component';
import { SharedModule } from '@summoners-app/shared/shared.module';
import { ManagementTeamsService } from './management.service';
import { HttpClientModule } from '@angular/common/http';
import { AddChampionShip } from './pages/add/add-championship';
import { SearchChampionShip } from './pages/search/search-championship';
import { httpInterceptorProvider } from '@summoners-app/core/interceptor';


const declaration = [
  ManagementComponent,
  AddChampionShip,
  SearchChampionShip
]
@NgModule({
  
  imports: [
    CommonModule,
    ManagementRoutingModule,
    HttpClientModule,
    SharedModule
  ],
  declarations: declaration,
  exports: [...declaration, HttpClientModule],
  providers: [ManagementTeamsService, httpInterceptorProvider]
})
export class ManagementModule { }
