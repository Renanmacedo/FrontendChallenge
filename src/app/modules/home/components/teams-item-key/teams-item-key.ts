import { Component, Input, OnInit } from "@angular/core";
import { Team } from "@summoners-app/core/model/teams";
import { Tournament } from "@summoners-app/core/model/tournament";

@Component({
    selector: 'summoners-team-item-key',
    templateUrl: './teams-item-key.html',
    styleUrls: ['./teams-item-key.scss']
})
export class TeamsItemKey implements OnInit{

    @Input()
    get tournament() {  return this._tournament}
    set tournament(tournament: Tournament) {
        this._tournament = tournament;
        this.mountQualification();
        this.mountSemifinal();
    }

    private _tournament: Tournament  = new Tournament();

    quantityQualification: number;
    quantitySemifinal: number;
    constructor() {}

    ngOnInit() {}

    getValueSemi(index: number, key: string) {
        const result = this.tournament.qualification.map( team => team.find( team => team.winner ))
        return result.length > 0 ? (result[index]  !== undefined ? result[index][key] : '?') : '?' ;
    }

    getValueQualification(index: number, key: string) {  
        const result = this.tournament.teams.map( team => team.find( team => team.winner ))
        return result.length > 0 ? result[index][key] : '?';
    }

    getValueChampion(key: string) {
        if(!this.hasChampion) return "?";
        return this.tournament.champion[0][key];

    }
    private mountQualification() {
        
      this.quantityQualification = this.tournament ? this.tournament.teams.length : 0;
    }
    private mountSemifinal() {
        this.quantitySemifinal = this.tournament && this.tournament.semiFinal ? this.tournament.semiFinal.length : 0;
    }

    get hasChampion() {
        return this.tournament && this.tournament.champion && this.tournament.champion.length > 0
    }
    get hasTeams() {
        return this.tournament && this.tournament.qualification && this.tournament.qualification.length > 0;
    }
}