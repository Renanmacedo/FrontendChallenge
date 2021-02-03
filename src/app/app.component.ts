import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  
  menuItems: Array<any> = new Array<any>();


  ngOnInit() {
    this.menuItems = [
      {
        label: 'Home'
        , icon: 'home'
        , url: 'home'
      },
      { 
        label: 'Gerenciar Equipes'
        , icon: 'device_hub'
        , url: 'management/search'
      }
    ]
  }
}
