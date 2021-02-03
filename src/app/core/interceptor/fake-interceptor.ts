import { Injectable } from "@angular/core";
import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http'
import { Observable, of } from "rxjs";
import { delay, dematerialize, materialize, mergeMap } from "rxjs/operators";
import { Tournament } from "../model/tournament";


/**
 * create a fake backend api
 */
@Injectable()
export class FakeInterceptor implements HttpInterceptor {

    constructor() {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        return of(null)
            .pipe(mergeMap((value, index) => this.handleRequestRouter(next, req)))
            .pipe(materialize())
            .pipe(delay(500))
            .pipe(dematerialize())
    }


    // handle request and generate a response
    private handleRequestRouter(handle: HttpHandler, request: HttpRequest<any>) {

        switch(true) {

            case request.url.endsWith('/management/search') && request.method.toLowerCase() == 'get':
                return this.getAllTeam();
            case request.url.endsWith('/management/add') && request.method.toLowerCase() == 'post':
                this.addTeam(request.body);
                return  this.result(200, {});
            case request.url.endsWith('/management/update') && request.method.toLowerCase() == 'put':
                return this.updateTeam(request.body);
            default:
                return handle.handle(request);
        }
        
    }

    private result(code: number, response: any) {

        return of(new HttpResponse( { status: code, body: response}));
    }

    private addTeam(body) {

        // check if has tournament created
        if(!this.hasTournament()) {
            const tournament = localStorage.getItem('tournament');
            let tournamentParsed  = JSON.parse(tournament);

            const { name } = tournamentParsed;
            if(tournamentParsed.teams && tournamentParsed.teams.lenght > 0)
                tournamentParsed.teams = { teams: [...tournamentParsed.teams, ...body.teams]} ;

            else 
                tournamentParsed = { ...tournamentParsed, teams: [...body.teams] }
            localStorage.setItem('tournament', JSON.stringify(tournamentParsed));
        }else{
            let tournamentParsed = { teams: [...body.teams], name: body.name, qualification: [], semiFinal: [], champion: [] }
            localStorage.setItem('tournament', JSON.stringify(tournamentParsed));
        }
    }
    private getAllTeam() {

        const tournament = localStorage.getItem('tournament');

        if(!tournament)
            return this.result(200, { teams: []})
        
        const tournamentParsed = JSON.parse(tournament);

        return this.result(200, {  ...tournamentParsed } );
    }

    private updateTeam(body) {
        let _tournament = new Tournament(); 
        _tournament = this.tournament;
        _tournament = { ...body } 
        localStorage.setItem('tournament', JSON.stringify(_tournament));
        return this.result(200, {message: 'OK'});
    }

    private hasTournament(): boolean {
        const tournament = localStorage.getItem('tournament');

        return !tournament;
    }


    get tournament(): Tournament{
        const _tournament = localStorage.getItem('tournament');

        if(this.hasTournament()) return null;

        return JSON.parse(_tournament)
    }
}