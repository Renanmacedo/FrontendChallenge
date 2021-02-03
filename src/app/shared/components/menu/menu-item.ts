import { Component, ChangeDetectionStrategy, ViewEncapsulation, ElementRef, Inject, Input, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { Sm_MENU_PANEL, SmMenuPanel } from './menu-panel';


@Component({
    selector: 'sm-menu-item, [SmMenuItem]'
    , templateUrl: './menu-item.html'
    , changeDetection: ChangeDetectionStrategy.OnPush
    , encapsulation: ViewEncapsulation.None
    , host: {
        '(click)': '_handleClick($event)'
        , '(mouseenter)': '_handleMouseEnter($event)'
        , '[attr.role]': 'role'
        , 'class': 'sm-menu-item'
    }
})
export class SmMenuItem implements OnDestroy {

    @Input() role: String = 'menuitem';

    readonly _hovered: Subject<SmMenuItem> = new Subject<SmMenuItem>();

    _triggersSubmenu: Boolean = false;

    _highlighted: Boolean = false;

    @Input()
    get disabled() { return this._disabled }
    set disabled(disable: Boolean) { this._disabled = disable };
    _disabled: Boolean = false;


    _document: Document;

    constructor(
        private elementRef: ElementRef<HTMLElement>
        , @Inject(DOCUMENT) private document: any
        , @Inject(Sm_MENU_PANEL) public _parentMenu: SmMenuPanel<SmMenuItem>
    ) {

        this._document = document;
    }

    ngOnDestroy() {
        this._hovered.complete();
    }

    /**
     * handle click to disabled event if disabled is tru;
     * @param event
     */
    _handleClick(event: Event) {
        this._parentMenu.close.next("click");
        if (this.disabled) {
            event.stopPropagation();
            event.preventDefault();
        }
    }
    /**
     * emmiter the event mouse enter in item inside the component
     * @param event
     */
    _handleMouseEnter(event: Event) {
        this._hovered.next(this);

    }

}
