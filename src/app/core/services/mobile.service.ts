import { Injectable, OnInit } from '@angular/core';
import { Subject, from } from 'rxjs';

const BREAK_POINT = [
    { breakPoint: 'unknow', width: 0 },
    { breakPoint: 'xs', width: 320 },
    { breakPoint: 'sm', width: 576 },
    { breakPoint: 'md', width: 768 },
    { breakPoint: 'lg', width: 992 },
    { breakPoint: 'xl', width: 1200 }
];

@Injectable()
export class MobileService {

    private screenChange: Subject<MobileBreakPonts> = new Subject<MobileBreakPonts>();

    _screenChanges$ = this.screenChange.asObservable();

    private breakPoints: Map<string, number> = new Map<string, number>();

    constructor() {
        this._firstLoadScreen();
        this._monitoreChangeScreen();
    }

    _monitoreChangeScreen() {
        window.addEventListener('resize', e => {
            this.screenChange.next(this._getWithScreen(window.innerWidth));
        })

    }
    _firstLoadScreen() {
        this.screenChange.next(this._getWithScreen(window.innerWidth));
    }
    private _getWithScreen(_width: number): MobileBreakPonts {

        for (let i = 0; i < BREAK_POINT.length; i++) {

            if (!BREAK_POINT[i + 1]) {
                if (_width >= BREAK_POINT[i].width) {
                    return BREAK_POINT[i]
                }
            } else {
                if (_width >= BREAK_POINT[i].width && _width <= BREAK_POINT[i + 1].width) {
                    return BREAK_POINT[i];
                }
            }
        }
    }
}

export interface MobileBreakPonts {

    breakPoint: string;
    width: number;

}