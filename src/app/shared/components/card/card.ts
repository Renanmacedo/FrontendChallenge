import { Component, ViewEncapsulation, OnInit, Optional, Inject, ElementRef, Directive, Input } from '@angular/core';
import { DOCUMENT } from '@angular/common';


export interface SmCardBase {
    elementRef: ElementRef;
}
@Directive({
    selector: 'sm-card-title, [sm-card-title], [SmCardTitle]'
    , host: {
        'class': 'sm-card-title'
    }
})
export class SmCardTitle { }


@Directive({
    selector: 'sm-card-subtitle,[sm-card-subtitle],[SmCardSubtitle]'
    , host: {
        'class': 'sm-card-subtitle'
    }
})
export class SmCardSubtitle { }

@Component({
    selector: 'sm-card-header, [sm-card-header]'
    , template: `

        <ng-content select="sm-avatar, [sm-avatar]"></ng-content>

        <div class="sm-card-header-text" *ngIf="textVisible">
            <ng-content select="sm-card-title, [sm-card-title], [SmCardTitle],  sm-card-subtitle, [sm-card-subtitle], [SmCardSubtitle]">
            </ng-content>
        </div>

        <ng-content></ng-content>
    `
    , host: {
        'class': 'sm-card-header'
    },
    encapsulation: ViewEncapsulation.None
})
export class SmCardHeader implements SmCardBase {

    @Input() textVisible: boolean = false;
    constructor(public elementRef: ElementRef<HTMLElement>) { }
}
@Component({
    selector: 'sm-card-body, [sm-card-body]'
    , template: `<ng-content></ng-content>`
    , host: {
        'class': 'sm-card-body'
    },
    encapsulation: ViewEncapsulation.None
})
export class SmCardBody implements SmCardBase {
    constructor(public elementRef: ElementRef<HTMLElement>) { }
}
@Component({
    selector: 'sm-card-fotter, [sm-card-fotter]'
    , template: `<ng-content></ng-content>`
    , host: {
        'class': 'sm-card-fotter'
    }
    , encapsulation: ViewEncapsulation.None
})
export class SmCardFotter implements SmCardBase {

    constructor(public elementRef: ElementRef<HTMLElement>) { }
}
@Component({
    selector: 'sm-card, [sm-card]'
    , encapsulation: ViewEncapsulation.None
    , template: `
        <ng-content select="sm-card-header"></ng-content>
        <ng-content select="sm-card-body"></ng-content>
        <ng-content select="sm-card-fotter"></ng-content>
    `
    , host: {
        'class': 'sm-card'
    }
})
export class SmCard implements OnInit, SmCardBase {

    /**
     *
     */
    constructor(
        @Optional() @Inject(DOCUMENT) private _document: any
        , public elementRef: ElementRef<HTMLElement>
    ) { }

    /**
     *
     */
    ngOnInit() { }

}
