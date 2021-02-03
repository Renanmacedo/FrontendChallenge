import { Component, TemplateRef, Input, ViewEncapsulation, OnInit, Directive, ElementRef, ChangeDetectionStrategy, AfterContentInit } from '@angular/core';
import { ThemeServices } from '../../../core/services/theme.services';

export interface Header {

    templateRef: TemplateRef<any>;
}

@Directive({ selector: '[headerTemplate]' })
export class SmHeaderTemplate { }

@Component(
    {
        selector: 'sm-header'
        , templateUrl: './header.html'
        , encapsulation: ViewEncapsulation.None
        , exportAs: 'smHeader'
        , host: {
            'class': 'sm-header sm-header-fixed'
        },
        changeDetection: ChangeDetectionStrategy.Default
    }
)
export class SmHeader implements OnInit, AfterContentInit {

    private minHeight: number = 60;
    private maxHeight: number = 150;
    private heightHeader: number = 150;
    private stopScrollElement: boolean = false;
    @Input() menuList: any;

    @Input()
    get color() { return this._color }
    set color(color: string) {
        this._color = color;
    }
    private _color: string;
    private headerHeight: number = 60;
    constructor(
        private elementRef: ElementRef<HTMLElement>
        , private themeServices: ThemeServices
    ) { }

    ngOnInit() {
        this.themeServices.themeChanges.subscribe(style => this.applyStyle(style));
        this.themeServices.scrollingEvent.subscribe(e => this.calculateHeight(e))
    }

    private calculateHeight(element: any) {
        if (this.stopScrollElement) return;
        if (!element) return;

        if (element.target.scrollTop == 0) {
            this.applyStyle({ height: this.maxHeight });
            return;
        }

        if (element.target.scrollTop >= this.maxHeight) return;
        this.heightHeader = this.maxHeight - element.target.scrollTop

        if (this.heightHeader < this.minHeight) return;

        this.applyStyle({ height: this.heightHeader });
    }
    private applyStyle(style) {
        if (style == null) this.stopScrollElement = true;
        else this.stopScrollElement = false;

        const height = style && style.height ? style.height : this.headerHeight;
        this.elementRef.nativeElement.style.height = `${height}px`;
        this.elementRef.nativeElement.style.animation = `height .2s linear`;
        this.elementRef.nativeElement.style.transition = 'all .2s linear 0s';
    }
    ngAfterContentInit() {

        this.updateColor();
    }
    updateColor() {
        this.elementRef.nativeElement.classList.add(`sm-${this._color}`)
    }

}
