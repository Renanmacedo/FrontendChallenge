import { Directive, ElementRef, Input, HostListener, HostBinding } from '@angular/core';

import { from } from 'rxjs';
import { filter } from 'rxjs/operators'

@Directive({
    selector: '[SmNavMenuTigger]'
    , exportAs: 'SmNavMenuTigger'
})
export class SmNavMenuTigger {

    @Input() expanded: HTMLDivElement;

    @HostBinding('attr.aria-expanded') arialExpanded = false;
    @HostBinding('class.sidemenu-collapse') collapse = false;

    constructor(public elementRef: ElementRef<any>) { }

    @HostListener('click', ['$event'])
    onToggle($event) {
        this.collapse = !this.collapse;
        this.arialExpanded = !this.arialExpanded;
        // this._updateClass(this.expanded.classList);
    }

    _updateClass(classList: DOMTokenList) {

        from(classList)
            .pipe(
                filter(cls => cls !== 'sidemenu-collapse')
            ).subscribe(e => {})
    }
}
