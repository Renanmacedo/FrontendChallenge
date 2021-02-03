import { Component, ViewEncapsulation, ChangeDetectionStrategy, Inject, ElementRef, AfterContentInit, OnDestroy, Input, ContentChildren, QueryList, ViewChild, TemplateRef, Directive, InjectionToken, Output, EventEmitter, NgZone, Optional, OnInit } from '@angular/core';
import { Observable, merge } from 'rxjs';
import { SmMenuItem } from './menu-item';
import { startWith, switchMap } from 'rxjs/operators';
import { SmMenuPositionY, SmMenuPositionX } from './menu-position';
import { SmMenuPanel, Sm_MENU_PANEL } from './menu-panel';


/**  */
export interface SmMenuOptionDefault {

    yPosition: SmMenuPositionY;

    xPosintion: SmMenuPositionX;

    overlapTrigger: boolean;

    backdropClass: string;

    hasBackdrop?: boolean;

}
/**  */
export interface ConnectPointChange {

    originX: string;

    originY: string;

    overlayY: string;

    overlayX: string;

    /** if change new origin the component */
    newOrigen?: boolean;
}

export const Sm_MENU_DEFAULT_OPTIONS =
    new InjectionToken<SmMenuOptionDefault>('sm-default-options'
        , {
            providedIn: 'root'
            , factory: Sm_MENU_DEFAULT_OPTIONS_FACTORY
        });

export function Sm_MENU_DEFAULT_OPTIONS_FACTORY(): SmMenuOptionDefault {
    return {
        yPosition: 'below'
        , xPosintion: 'before'
        , backdropClass: 'cdk-overlay-transparent-backdrop'
        , overlapTrigger: false
    }
}

@Component({
    selector: 'sm-menu'
    , exportAs: 'SmMenu'
    , templateUrl: './menu.html'
    , encapsulation: ViewEncapsulation.None
    , changeDetection: ChangeDetectionStrategy.Default
    , providers: [
        { provide: Sm_MENU_PANEL, useExisting: SmMenu }
    ]
})
export class SmMenu implements OnInit, AfterContentInit, SmMenuPanel<SmMenuItem>, OnDestroy {

    _xPosition: SmMenuPositionX = this._defaultOptions.xPosintion;
    _yPosition: SmMenuPositionY = this._defaultOptions.yPosition;


    @ContentChildren(SmMenuItem, { descendants: true }) _SmMenuAllItems: QueryList<SmMenuItem>;

    _SmMenuItems = new QueryList<SmMenuItem>();

    _classMenu: { [key: string]: boolean } = {};

    @Input()
    get xPosition(): SmMenuPositionX { return this._xPosition };
    set xPosition(x: SmMenuPositionX) { this._xPosition = x };


    @Input()
    get yPosition(): SmMenuPositionY { return this._yPosition };
    set yPosition(y: SmMenuPositionY) {
        this._yPosition = y

        this.updatePositionClass();
    };

    /** */
    @Input() backdropClass: string = this._defaultOptions.backdropClass;

    /** */
    @ViewChild(TemplateRef, { static: true }) templateRef: TemplateRef<any>;

    /** */
    @Input()
    get hasBackdrop(): boolean { return this._hasBackdrop };
    set hasBackdrop(value: boolean | undefined) { this._hasBackdrop = value }

    private _hasBackdrop: boolean | undefined = this._defaultOptions.hasBackdrop;

    /** */
    @Input()
    get overlapTrigger(): boolean { return this._overlapTrigger };
    set overlapTrigger(value: boolean) { this._overlapTrigger = value };

    _overlapTrigger: boolean = this._defaultOptions.overlapTrigger;

    @Input('class')
    set panelClass(classes: string) {
        const previousPanelClass = this._previousPanelClass;

        if (previousPanelClass && previousPanelClass.length) {
            previousPanelClass.split(' ').forEach((className: string) => {
                this._classMenu[className] = false;
            });
        }

        this._previousPanelClass = classes;

        if (classes && classes.length) {
            classes.split(' ').forEach((className: string) => {
                this._classMenu[className] = true;
            });

            this.elementRef.nativeElement.className = '';
        }
    }
    private _previousPanelClass: string;

    /** */
    parentId?: string;
    /** */
    parentMenu: SmMenuPanel<any>;

    /** */
    @Output() readonly closed: EventEmitter<void | 'click'> =
        new EventEmitter<void | 'click'>();

    /** */
    @Output() close: EventEmitter<void | 'click'> = this.closed;

    constructor(
        private elementRef: ElementRef<HTMLElement>
        , @Optional() @Inject(Sm_MENU_DEFAULT_OPTIONS) public _defaultOptions: SmMenuOptionDefault
        , private ngZone: NgZone
    ) { }

    ngOnInit() {
        this.updatePositionClass();
    }
    ngAfterContentInit() {
        // watch the change in item menu
        this._updateDirectDescendants();
    }

    ngOnDestroy() {
        this.closed.unsubscribe();
        this.close.unsubscribe();
    }

    /**
     * emmiter event where the event is call in item
     */
    _hovered(): Observable<SmMenuItem> {
        const itemChanges = this._SmMenuItems.changes as Observable<SmMenuItem>;
        return itemChanges.pipe(
            startWith(this._SmMenuItems)
            , switchMap((items: SmMenuItem | QueryList<SmMenuItem> | any) => merge(...items.map((item: SmMenuItem) => item._hovered)))
        ) as Observable<SmMenuItem>
    }

    updatePositionClass(x: SmMenuPositionX = this.xPosition, y: SmMenuPositionY = this.yPosition) {
        const classes = this._classMenu;
        classes['sm-menu-before'] = x === 'before';
        classes['sm-menu-after'] = x === 'after';
        classes['sm-menu-above'] = y === 'above';
        classes['sm-menu-below'] = y === 'below';
    }

    /**
     *
     * notify the changes if and reset event is equals the SmMenuPanel
     */
    private _updateDirectDescendants() {
        this._SmMenuAllItems.changes
            .pipe(startWith(this._SmMenuAllItems))
            .subscribe((items: QueryList<SmMenuItem>) => {
                this._SmMenuItems.reset(items.filter(item => item._parentMenu === this));
                this._SmMenuItems.notifyOnChanges();
            });
    }

}
