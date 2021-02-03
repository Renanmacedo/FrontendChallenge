import { Component, ViewEncapsulation, Input, OnChanges, OnInit, SimpleChanges, ViewChild, Optional, Inject, OnDestroy, ElementRef } from '@angular/core';
import { trigger, state, style, transition, group, animate } from '@angular/animations';
import { SmSidemenu } from '../sidemenu/sidemenu';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, distinctUntilChanged } from 'rxjs/operators';
import { ThemeColor } from '../../../helpers/utils';
@Component({
    selector: 'sm-nav-menu, [sm-nav-menu]'
    , templateUrl: `./nav-menu.html`
    , exportAs: 'SmNavMenu'
    , styleUrls: ['./nav-menu.scss']
    , host: {
        'class': 'sm-nav-menu'
    }
    , encapsulation: ViewEncapsulation.None
    , animations: [
        trigger('slideInOut', [
            state('in', style({ height: '*', opacity: 0 })),
            transition(':leave', [
                style({ height: '*', opacity: 0.2 }),
                group([
                    animate(200, style({ height: 0 })),
                    animate('200ms ease-out', style({ opacity: 0 }))
                ])
            ]),
            transition(':enter', [
                style({ height: '0', opacity: 0 }),
                group([
                    animate(200, style({ height: '*' })),
                    animate('300ms ease-in', style({ opacity: 1 }))
                ])
            ])
        ]),
        trigger('animateArrow', [
            state('expanded', style({ transform: 'rotate(-90deg)', 'margin-top': '-16px' }))
            , state('expand', style({ transform: 'rotate(0deg)', 'margin-top': '0px' }))
            , transition('expanded => expand', animate(200))
            , transition('expand => expanded', animate(200))
        ])
    ]
})
export class SmNavMenu implements OnChanges, OnInit, OnDestroy {

    @Input() sidemenu: SmSidemenu;
    @Input() items: any;
    /**  */
    @Input()
    get item() { return this._item; }
    set item(item: any) { this._item = item }
    _item: any

    /** */
    @Input()
    get level() { return this._level }
    set level(level: number) { this._level = level };
    _level: number = 0;

    /** */
    @Input()
    get navMenuLevel() { return this._navMenuLevel }
    set navMenuLevel(level: number) { this._navMenuLevel = level };
    _navMenuLevel: number = 0;

    /**  */
    @Input()
    get selectNode() { return this._selectNode }
    set selectNode(item: any) { this._selectNode = item }
    _selectNode: any;

    @Input()
    get color() { return this._color };
    set color(color: ThemeColor) {
        this._color = color;
    }
    _color: ThemeColor;

    expanded: boolean;
    classes: { [index: string]: boolean };

    isMenuOpen: boolean = true;
    isHouver: boolean = false;
    private _indexClicked: number;
    // mapper event navigation end
    navigationEnd: Observable<NavigationEnd>  = this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
    ) as Observable<NavigationEnd>;

    constructor(
        private router: Router
        , private activeRouter: ActivatedRoute
        , private elementRef: ElementRef<HTMLElement>
    ) {
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            distinctUntilChanged()
        ).subscribe(response => {});
    }

    ngOnInit() {
        this.changeDetectionToggleMenu();
        this.updateColor();
        this.classes = {'sm-navmenu-open': false };
    }

    updateColor() {
        this.elementRef.nativeElement.classList.add(`sm-${this._color}`)
    }
    ngOnChanges(changes: SimpleChanges) { }

    ngOnDestroy() { }

    changeDetectionToggleMenu() {
        this.sidemenu._changeSideMenu.subscribe(hasToggle => {
            this.isMenuOpen = hasToggle.openClick;
            this.isHouver = hasToggle.openHover;
            if (this.expanded)
                this.expanded = false;
        })
    }

    expand(item: any, index: number) {
        this.expanded = !this.expanded;
        if(this._indexClicked != index) {
          this._indexClicked = index;
          this.expanded = true;
          if(!this.sidemenu.open)
            this.sidemenu.toggle();
        }
        if(item.url) {
          this.router.navigate([item.url]);
          if(this.sidemenu.mobile)
            this.sidemenu.toggle();
        }
    }
    checkActive(url) {
      if(url)
        return this.router.isActive(url, true);
      return false;
    }
    isExpanded(index) {
        return this.expanded && index == this._indexClicked;
    }
    _hasItems(item): boolean {
        
        return item.children && item.children.length > 0;
    }
    // Verify if any router in submenu is active and applay effect wave
    checkAnyRouterActive(item) {
        return item.children.some(routes => this.checkActive(routes.url))
    }
}
