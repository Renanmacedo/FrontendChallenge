import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Service } from "@summoners-app/core/model/service";
import { Team } from "@summoners-app/core/model/teams";
import routes from "environments/routes";


@Injectable()
export class ManagementTeamsService extends Service<Team> {


    constructor(
        http: HttpClient
    ) {

        super(http, routes.base_url);
    }
}