import { Component, ViewEncapsulation, ElementRef, ChangeDetectionStrategy } from '@angular/core';

const LIST_MENU_ITEM_TEMPLATE = `
    <ng-content select="[sm-list-item-label]"></ng-content>

    <ng-content></ng-content>
`;

@Component({
    selector: 'sm-nav-menu-item, a[sm-nav-menu-item], button[sm-nav-menu-item]'
    , exportAs: 'SmNavMenuItem'
    , template: LIST_MENU_ITEM_TEMPLATE
    , encapsulation: ViewEncapsulation.None
    , host: {
        'class': 'sm-nav-menu-item'
    },
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SmNavMenuItem {

    constructor(
        private elementRef: ElementRef
    ) { }
}
