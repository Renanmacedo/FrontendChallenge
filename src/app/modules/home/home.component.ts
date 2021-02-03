import { Component, OnInit } from '@angular/core';
import { Team } from '@summoners-app/core/model/teams';
import { Tournament } from '@summoners-app/core/model/tournament';
import routes from 'environments/routes';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  tournament: Tournament = new Tournament();
  constructor(
    private homeService: HomeService
  ) {}
  ngOnInit() {

    this.homeService.find<Tournament>(routes.teams.findAllTeams)
    .subscribe(response => { 
      this.tournament = response
    });
  }


}
