import { Team } from "./teams";

export class Tournament {


    name: string;
    startDate: string;
    endDate: string;
    teams: Array<Team[]>;
    qualification: Array<Team[]>;
    semiFinal: Array<Team[]>;
    champion: Array<Team>;

    constructor() {
        this.teams = new Array<Team[]>();
        this.qualification = new Array<Team[]>();
        this.semiFinal = new Array<Team[]>();
        this.champion = new Array<Team>();
    }
}