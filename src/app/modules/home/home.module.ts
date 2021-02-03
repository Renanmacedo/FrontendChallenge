import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { SharedModule } from '@summoners-app/shared/shared.module';
import { Teams } from './components/teams/teams';
import { TeamsItemKey } from './components/teams-item-key/teams-item-key';
import { httpInterceptorProvider } from '@summoners-app/core/interceptor';
import { HomeService } from './home.service';



@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule
  ],
  declarations: [HomeComponent, Teams, TeamsItemKey],
  providers: [httpInterceptorProvider, HomeService]
  
})
export class HomeModule { }
