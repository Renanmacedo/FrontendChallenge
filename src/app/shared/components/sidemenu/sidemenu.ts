import {
  Component
  , Input
  , ViewEncapsulation
  , ChangeDetectionStrategy
  , Output
  , EventEmitter
  , ElementRef
  , ContentChild
  , ContentChildren
  , QueryList
  , HostListener
  , DoCheck
  , AfterContentInit
  , ViewChild
  , OnDestroy
  , Inject
  , forwardRef
  , Optional
  , ChangeDetectorRef
  , NgZone
  , InjectionToken
  , Directive
} from '@angular/core';
import { DOCUMENT } from '@angular/common'
import { fromEvent, Subject } from 'rxjs';
import { MobileService } from '../../../core/services/mobile.service';
import { startWith, takeUntil, debounceTime } from 'rxjs/operators';
import { ThemeColor } from '../../../helpers/utils';
import { ThemeServices } from '../../../core/services/theme.services';
import {rotateAnimation } from '../../../helpers/animation';

export const SM_SIDEMENU_CONTAINER = new InjectionToken('SM_SIDEMENU_CONTAINER');

export type SmSidemenutMode = 'side' | 'push';


/**
 * content infos is rendered inside sidemenu
 */
@Directive({ 
  selector: 'sm-side-content-info,[SmSideContentInfo]', 
  host: { 'class': 'sm-side-content' } 
})
export class SmSideContent { }

@Component({
  selector: 'sm-sidemenu-content, [sm-sidemenu-content]'
  , template: `
       <ng-content></ng-content>
  `
  , encapsulation: ViewEncapsulation.None
  , changeDetection: ChangeDetectionStrategy.OnPush
  , host: {
    'class': 'sm-sidemenu-content'
    , '[style.margin-left.px]': 'left'
  }
})
export class SmSidemenuContent implements AfterContentInit, OnDestroy {

  left: number = 0;
  private container: SmSidemenuContainer;
  /**
   *
   * @param templateRef
   */
  constructor(
     private elementRef: ElementRef<HTMLElement>
    , private _changeDetectionRef: ChangeDetectorRef
    , private themeService: ThemeServices
    ,@Inject(forwardRef(() => SmSidemenuContainer)) public _container?: any,
  ) {}
  @HostListener('scroll', ['$event']) public onScroll(event) {
    this.themeService.scrollingEvent.next(event)
  }
  ngAfterContentInit() {
    // monite by resize event the window
    this._container._contentMarginsChanges.subscribe(marginsChanges => {
      this.updateMargins(marginsChanges)
      this._changeDetectionRef.markForCheck();
    })
  }
  
  updateMargins(margins) {
    this.left = this._container._side.mobile ? 0 : margins.left
  }
  ngOnDestroy() {
    this.themeService.scrollingEvent.complete();
  }
}
/*
  , '(mouseenter)': 'handleMouseOver($event)'
  , '(mouseleave)': 'handleMouseOut($event)'
*/

@Component({
  selector: 'sm-sidemenu, [sm-sidemenu]'
  , templateUrl: './sidemenu.html'
  , encapsulation: ViewEncapsulation.None
  , changeDetection: ChangeDetectionStrategy.Default
  , exportAs: 'SmSidemenu'
  , animations: [rotateAnimation]
  , host: {
    'class': 'sm-sidemenu sm-sidemenu-open'
    , '[class.sm-sidemenu-close]': 'open == false'
  }
})
export class SmSidemenu implements AfterContentInit, OnDestroy {
  rotate = { value: "stop", params: { rad: '-180deg' } };
  @Input() backdrop: boolean = false;

  @Input() applicationName: string;

  @Input()
  get color() { return this._color };
  set color(color: ThemeColor) {

    this._color = color;
  }
  _color: ThemeColor;

  @ViewChild('side-inner-content', { static: true }) sideContentInner;

  /** */
  @Input()
  get opened() { return this._opened }
  set opened(open: boolean) { this._opened = open }
  _opened: boolean = true;
  /** **/
  @Input()
  get mode(): SmSidemenutMode { return this._mode }
  set mode(mode: SmSidemenutMode) {
    this._mode = mode;
    this._modeChange.next();
  }
  private _mode: SmSidemenutMode = 'side';

  @Input()
  get position() { return this._position }
  set position(position: string) {
    this._position = position;
  }

  fixed: boolean = true;

  private _position: string = 'auto';



  mobile: boolean = false;
  /**
   *
  */
  classes: { [key: string]: boolean };
  /**
   *
  */
  private changeSideMenu: Subject<any> = new Subject<any>();
  /**
   *
  */
  private _navItems: any[];
  /**
   * public event changeSidemenu
  */
  _changeSideMenu = this.changeSideMenu.asObservable();
  /**
   *
  */
  _inHouver: boolean = false;
  /**
   *
  */
  _toggle: boolean = true;
  /**
   *
  */
  _open: boolean = true;
  /**
   *
  */
  _isCheckedFixed: boolean = true;
  /**
   *
  */
  @Output() readonly toggleEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  _modeChange = new Subject<void>();

  _screenChange = new Subject<void>();
  constructor(
    private elementRef: ElementRef<HTMLElement>
    , private mobileService: MobileService
    , @Optional() @Inject(SM_SIDEMENU_CONTAINER) public _container?: any
  ) {
    this.monitoreChangesResize();
    this.mobileService._firstLoadScreen();
  }

  handleMouseOver($event: MouseEvent) {
    if (!this.fixed && !this.mobile) {
      this._open = true;
      this._inHouver = true;
      this.changeSideMenu.next({ openClick: false, openHover: this._open })
      this._updateClass();
    }

  }
  handleMouseOut($event: MouseEvent) {
    if (!this.fixed && !this.mobile) {
      this._open = false;
      this._inHouver = false;
      this.changeSideMenu.next({ openClick: false, openHover: this._open })
      this._updateClass();
    }
  }

  ngAfterContentInit() {
    this.opened = this._open = this._toggle = true;
    this._updateClass();
    this.changeSideMenu.next({ openClick: this._open, openHover: false });
    this.updateColor();
  }

  ngOnDestroy() {
    this.changeSideMenu.complete();
    this._modeChange.complete();
    this._screenChange.unsubscribe();
  }
  /**
   * public instance component
   */
  toggle() {

    this.fixed = this._open = this._toggle = !this._toggle;
    this.toggleEvent.emit(this._toggle);

    this.changeSideMenu.next({ openClick: this._open, openHover: false });

    this._updateClass();
  }

  get _width(): number {
    return this.elementRef.nativeElement ? (this.elementRef.nativeElement.offsetWidth || 0) : 0;
  }
  get width() { return this._width }
  /**
   * mapper fixed side in component
   * @param $event
   */
  changeFixedSide($event) {
    this._isCheckedFixed = !this._isCheckedFixed;

    this.toggle();
  }

  close() {
    if (this._opened) {
      this._opened = this._open = this._toggle = !this._toggle;

      this._updateClass();
    }
  }
  get open() {
    return this._open;
  }
  // check if the position is defined with fixed and apply distance in px of the header
  get checkPosition() {
    return this._position == "fixed" ? 65 : 0;
  }
  get getState() {
    this.rotate = this.open ? { value: ':enter', params: { rad: '-180deg'}} 
      : { value: 'stop', params: { rad: '-0deg'} };;
    return this.rotate;
  }

  private monitoreChangesResize() {
    this.mobileService._screenChanges$.subscribe(breakPoints => {
      if (breakPoints.breakPoint == 'sm' || breakPoints.breakPoint == 'xs' || breakPoints.width === 0) {
        this.mobile = true
      } else {
        this.mobile = false;
      }

      this._screenChange.next();
    })

  }
  _updateClass() {
    this.classes = {
      'sm-sidemenu-open': this._open
      , 'sm-sidemenu-open-mobile': this.mobile && this._open
    }
  }
  updateColor() {
    this.elementRef.nativeElement.classList.add(`sm-${this._color}`)
  }

}


@Component({
  selector: 'sm-sidemenu-container'
  , template: `
      <ng-content select="sm-sidemenu"></ng-content>
      <ng-content select="sm-sidemenu-content"></ng-content>
  `, encapsulation: ViewEncapsulation.None
  , changeDetection: ChangeDetectionStrategy.OnPush
  , host: {
    'class': 'sm-sidemenu-container'
    , '[class.sm-overlay-container]': '_backdrop'
  }
  , providers: [{
    provide: SM_SIDEMENU_CONTAINER
    , useClass: SmSidemenuContainer
  }]
})
export class SmSidemenuContainer implements OnDestroy, DoCheck, AfterContentInit {

  private document: Document | null;
  /**
   * mapper dir RTL
   */
  _left: SmSidemenu | null;
  _right: SmSidemenu | null;

  /**
   * propteis change event sidemenu
   */
  _side: SmSidemenu | null;
  @ContentChildren(SmSidemenu, { descendants: true }) _allSide: QueryList<SmSidemenu>;

  _siders = new QueryList<SmSidemenu>();

  @ContentChild(SmSidemenuContent, { static: true }) _content: QueryList<SmSidemenuContent>;

  @ViewChild(SmSidemenuContent, { static: true }) _userContent: SmSidemenuContent;

  _contentMargins: { left: number | null, right: number | null } = { left: null, right: null };

  readonly _contentMarginsChanges = new Subject<{ left: number | null, right: number | null }>();

  private readonly _destroyed = new Subject<void>();

  private readonly _doCheckSubject = new Subject<void>();

  _hasBackdrop: boolean = false;

  get scrollabe() {
    return this._content || this._userContent;
  }



  /**
   *
   * @param templateRef
   */
  constructor(
    private _elementRef: ElementRef<HTMLElement>
    , private _ngZone: NgZone
    , private _changeDetectionRef: ChangeDetectorRef
    , @Optional() @Inject(DOCUMENT) private _document: any
  ) {

    this.document = this._document;
  }

  ngDoCheck() {
    if (this._isSidemenuOpen(this._side))
      this._ngZone.runOutsideAngular(() => this._doCheckSubject.next())
  }


  ngAfterContentInit() {
    /**
     * changes side inside in container
     */
    this._allSide.changes
      .pipe(startWith(this._allSide), takeUntil(this._destroyed))
      .subscribe((sides: QueryList<SmSidemenu>) => {
        this._siders.reset(sides.filter(item => !item._container || item._container === this));
        this._siders.notifyOnChanges();
      });

    this._siders.changes.pipe(startWith(null))
      .subscribe(() => {
        this._validateSide();

        this._allSide.forEach((item: SmSidemenu) => {

          this._watchToggleChange(item);
          this._watchMobileActive(item);

        });
        this._changeDetectionRef.markForCheck();
      })

    this._doCheckSubject.pipe(
      debounceTime(10)
      , takeUntil(this._destroyed))
      .subscribe(() => this.updateChangeMargins())
  }

  /**
   * set margin content where the toggle is call
   */
  updateChangeMargins() {
    let left = 0;
    let right = 0;

    if (this._left && this._left._open && !this._left.mobile) {
      left += this._left._width;
    } else {
      if (this._left.mobile) {
        left = 0;
      } else {
        left += 70; // close sidemenu minimo
      }
    }
    
    if (left !== this._contentMargins.left) {
      this._contentMargins = { left, right };
      this._ngZone.run(() => this._contentMarginsChanges.next(this._contentMargins));
    }

  }

  /**
   *
   * @param side
   */
  private _watchToggleChange(side: SmSidemenu) {

    side._changeSideMenu.pipe(takeUntil(this._siders.changes)).subscribe(() => {
      this.updateChangeMargins();
      this._applyBackdrop(side);
    })
  }

  private _watchMobileActive(side: SmSidemenu) {

    side._screenChange.pipe(startWith(null)).subscribe(() => {
      // apply overlay mobile only
      this.updateChangeMargins();
      this._handleOutsideClick(side);
      this._applyBackdrop(side);
    })
  }
  private _applyBackdrop(side: SmSidemenu) {

    if (!side.open && this._checkIsPresentBackdrop())
      this._removeBackdrop();


    if (side.backdrop && side.open && !side.mobile)
      this._appendBackdrop();
    if (side.mobile && side.open)
      this._appendBackdrop();

  }

  private _appendBackdrop() {

    if (this._checkIsPresentBackdrop())
      return;
    const fragment = this.document.createDocumentFragment();
    const element = this.document.createElement('div');
    element.classList.add("sm-backdrop-sidemenu");
    fragment.append(element);
    this._elementRef.nativeElement.append(fragment);
  }

  private _removeBackdrop() {


    const element = this._elementRef.nativeElement.getElementsByClassName("sm-backdrop-sidemenu")[0];
    if (element)
      element.remove();
  }

  private _checkIsPresentBackdrop(): boolean {
    return typeof this._elementRef.nativeElement.getElementsByClassName("sm-backdrop-sidemenu")[0] !== "undefined";
  }
  /**
   *
   */
  _validateSide() {
    this._side = null;
    this._allSide.forEach((side: SmSidemenu) => {
      if (this._side == null)
        this._side = side;
    });

    this._left = this._right = this._side;
  }
  /**
   *
   */
  get _backdrop(): boolean {
    return this._side._open && (this._side.backdrop || !!this._hasBackdrop);
  }
  private _isSidemenuOpen(side: SmSidemenu | null): side is SmSidemenu {
    return side != null && typeof side !== 'undefined' && side._open;
  }

  private _handleOutsideClick(side: SmSidemenu | null) {
    fromEvent(this.document, 'click')
      .subscribe(response => {
        const backDropElement = this._elementRef.nativeElement.getElementsByClassName("sm-backdrop-sidemenu")[0] as HTMLElement;
        if (backDropElement && backDropElement.contains(response.target as HTMLElement)) {
          this._removeBackdrop();
          side.toggle();
        }
      })
  }
  ngOnDestroy() {
    this._contentMarginsChanges.complete();
    this._destroyed.complete();
    this._siders.destroy();
    this._doCheckSubject.complete();
  }

}
