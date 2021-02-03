import { Component, ViewEncapsulation } from "@angular/core";

@Component({
    selector: 'summoners-teams-container',
    templateUrl: './teams.html',
    styleUrls: ['./teams.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {
        'class': 'teams-container'
    }
})
export class Teams {
    
    constructor() {}
}