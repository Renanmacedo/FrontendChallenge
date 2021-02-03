import {
    Input
    , ElementRef
    , Component,
    AfterContentInit,
    Directive
} from '@angular/core';
import { ThemeColor } from '../../../helpers/utils';

const ATTR_BUTTONS = [
    'sm-link-button',
    'sm-icon-button',
    'sm-outline-button',
    'sm-round-button'
];
@Component({
    selector: 'button[sm-button], button[sm-icon-button], button[sm-link-button], a[sm-icon-button], a[sm-link-button],a[sm-button], button[sm-round-button],a[sm-round-button]',
    exportAs: 'SmButton',
    templateUrl: './button.html',
    host: {
        'class': 'sm-button',
        '[class.sm-button-disabled]': '_disabled'
    }
})
export class SmButton implements AfterContentInit {

    @Input()
    get color() { return this._color };
    set color(color: ThemeColor) {

        this._color = color;
        this.updateColor();
    }
    _color: ThemeColor;
    @Input()
    get disabled() { return this._disabled };
    set disabled(disabled: boolean) {

        this._disabled = disabled;
        (this.elementRef.nativeElement as any).disabled = this._disabled;
    }
    private _disabled: boolean;

    isButtonIcon: boolean = this.hasAttribute('sm-button-icon');
    isButtonLink: boolean = this.hasAttribute('sm-button-link');
    isButtonOutline: boolean = this.hasAttribute('sm-button-outline');
    isRoundButton: boolean = this.hasAttribute('sm-round-button');

    private oldRef: ElementRef<HTMLElement | HTMLButtonElement>;
    constructor(
        private elementRef: ElementRef<HTMLElement | HTMLButtonElement>
    ) { }

    ngAfterContentInit() {
        this.updateColor();
        this.applayClassByAttr();
    }

    applayClassByAttr() {
        for (const attr of ATTR_BUTTONS) {
            if (this.hasAttribute(attr))
                this.host.classList.add(attr);
        }
    }
    /**
     *
     */
    updateColor() {
        if (this._color) {
            this.host.classList.add(`sm-${this._color}`)
        }
    }
    get host() {
        return this.elementRef.nativeElement;
    }

    /**
     * check if the attributes
     * @param attr
     */
    hasAttribute(attr: string) {
        return this.host.hasAttribute(attr);
    }
}

@Directive({ selector: 'SmFloatButton, sm-float-button' })
export class SmFloatButton {
    constructor() { }
}
