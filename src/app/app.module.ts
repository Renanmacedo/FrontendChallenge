import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from '@summoners-core/core.module';
import { SharedModule } from '@summoners-shared/shared.module';
import { SmSidemenuModule } from '@summoners-shared/index';
import { HomeModule } from '@summoners-app/modules/home/home.module';
import { ManagementModule } from '@summoners-app/modules/management/management.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CoreModule,
    SmSidemenuModule,
    SharedModule,
    HomeModule,
    ManagementModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
