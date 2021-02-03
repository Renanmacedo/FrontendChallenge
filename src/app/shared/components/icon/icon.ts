import { Component, Input, ViewEncapsulation, ElementRef } from '@angular/core';
import { ThemeColor } from '../../../helpers/utils';

@Component({
    selector: '[sm-icon], sm-icon'
    , exportAs: 'SmIcon'
    , template: `<ng-content></ng-content>`
    , encapsulation: ViewEncapsulation.None
    , host: {
        'class': 'material-icons'
    }
})
export class SmIcon {

    @Input()
    get classIcon() { return this._cls; }
    set classIcon(cls: string) { this._cls = cls; }
    _cls: string = 'material-icons';


    @Input()
    get color() { return this._color };
    set color(color: ThemeColor) {
        this._color = color;
    }
    private _color: ThemeColor;

    @Input()
    get size() { return this._size }
    set size(value: number) { this._size = value }
    private _size: number = 24
    constructor(
        private elementRef: ElementRef<HTMLElement>
    ) { }

    ngOnInit() {
        if (this._color)
            this.elementRef.nativeElement.classList.add(`sm-${this._color}`)
        this.elementRef.nativeElement.classList.add(`md-${this.size}`);
    }
}
