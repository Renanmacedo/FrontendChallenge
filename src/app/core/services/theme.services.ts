import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class ThemeServices {

    type: string = "";

    themeChanges: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    scrollingEvent: BehaviorSubject<Event> = new BehaviorSubject<Event>(null);

    stateChanges$ = new Subject<void>();

    constructor() { }

    private validateEvent() {
        ["header", "sidemenu", "notification", "nav-menus"]
    }
}