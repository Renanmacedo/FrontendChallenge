import { Component, OnInit } from "@angular/core";
import { Team } from "@summoners-app/core/model/teams";
import { Tournament } from "@summoners-app/core/model/tournament";
import { Teams } from "@summoners-app/modules/home/components/teams/teams";
import routes from "environments/routes";
import { of } from "rxjs";
import { ManagementTeamsService } from "../../management.service";

@Component({
    selector: 'summoners-search-championship',
    templateUrl: './search-championship.html',
    styleUrls: ['./search-championship.scss']
})
export class SearchChampionShip implements OnInit{

    listTeams: Array<Team[]> = new Array<Team[]>();
    tournament: Tournament = new Tournament();

    constructor(private managerService: ManagementTeamsService) {}


    ngOnInit() {
        this.managerService.find<Tournament>(routes.teams.findAllTeams).subscribe( result => {
            
            this.tournament = result;
            console.log(this.tournament);
        });
    }

    // change winner in key tournament
    onWinner($event, item: Team, index: number, indexParent: number){
        this.tournament.teams[indexParent].forEach(team => team.winner = false);

        this.tournament.teams[indexParent][index].winner = $event;
    }
    onWinnerSemiFinal($event, item: Team, index: number, indexParent: number){
        this.tournament.qualification[indexParent].forEach(team => team.winner = false);
        this.tournament.qualification[indexParent][index].winner = $event;
    }
    onChapion($event, item: Team, index: number, indexParent: number){
        this.tournament.semiFinal[indexParent].forEach(team => team.winner = false);
        this.tournament.semiFinal[indexParent][index].winner = $event;
    }

    saveQualification() {
        // find only teams with winner is true
        const winners = this.tournament.teams.map(team => team.filter( _team => _team.winner));
        let qualification = [];

        // loop create winner the qualification and save 
        for(let i = 0; i < winners.length; i++) {
            
            if(winners.length > 2 && winners[i + 2] == undefined) break;
            if(winners.length <= 2 && winners[i + 1] == undefined) break;
            let team = [ [
                {...winners[i == 0 ? i : i + 1][0], winner: false,points: 0},
                {...winners[i == 0 ? i+ 1 : i+ 2][0], winner: false,points: 0}
            ]];
            qualification.push(...team);
        }
        this.tournament.qualification = qualification;
        this.managerService.put(routes.teams.updateTeams, this.tournament)
            .subscribe( response => {})
    }
    saveSemi() {
        const winners = this.tournament.qualification.map(team => team.filter( _team => _team.winner));
        let semi = [];

        // loop create winner the semi and save 
        for(let i = 0; i < winners.length; i++) {
            
            if(winners.length > 2 && winners[i + 2] == undefined) break;
            if(winners.length <= 2 && winners[i + 1] == undefined) break;
            let team = [ [
                {...winners[i == 0 ? i : i + 1][0], winner: false, points: 0},
                {...winners[i == 0 ? i+ 1 : i+ 2][0], winner: false, points: 0}
            ]];
            semi.push(...team);
        }
        this.tournament.semiFinal = semi;

        this.managerService.put(routes.teams.updateTeams, this.tournament)
            .subscribe( response => {})
    }
    saveChampion() {
        const winners = this.tournament.semiFinal.map(team => team.filter( _team => _team.winner));
        let champion = [];

        // loop create winner the champion and save 
        for(let i = 0; i < winners.length; i++) 
            champion.push(...winners[i]); 
        this.tournament.champion = champion;

        this.managerService.put(routes.teams.updateTeams, this.tournament)
            .subscribe( response => {})
    }

   
    get hasQualification() {
        return this.tournament && this.tournament.qualification && this.tournament.qualification.length > 0;
    }
    get hasSemi() {
        return this.tournament && this.tournament.semiFinal && this.tournament.semiFinal.length > 0;
    }

    get hasFinal() {
        return this.tournament && this.tournament.champion && this.tournament.champion.length > 0;
    }

    get hasTeams() {
        return this.tournament && this.tournament.teams && this.tournament.teams.length > 0;
    }
    get disableSaveQualification() {
        if(!this.hasTeams) return true;
        
        const result = this.tournament.teams.filter( team => team.filter( _team => _team.winner == false).length > 1);

        return result && result.length > 0;
        
    }
    get disabledSaveSemi() {
        if(!this.hasQualification) return true;

        const result = this.tournament.qualification.filter( team => team.filter( _team => _team.winner == false).length > 1);

        return result && result.length > 0;
    }
    get disabledSaveFinal() {
        if(!this.hasSemi) return true;
        const result = this.tournament.semiFinal.filter( team => team.filter( _team => _team.winner == false).length > 1);

        return result && result.length > 0;
    }
}