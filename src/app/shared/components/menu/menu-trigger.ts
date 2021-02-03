import {
    Directive
    , ElementRef
    , Input
    , Optional
    , Inject
    , AfterContentInit
    , InjectionToken
    , Output
    , Self
    , ViewContainerRef
    , EventEmitter,
    OnDestroy
} from '@angular/core';
import { SmMenu } from './menu';
import { DOCUMENT } from '@angular/common';
import {
    OverlayRef
    , Overlay
    , ScrollStrategy,
    OverlayConfig,
    FlexibleConnectedPositionStrategy,
    HorizontalConnectionPos,
    VerticalConnectionPos
} from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';

import { Subscription, of, merge } from 'rxjs';
import { SmMenuPanel } from './menu-panel';
import { SmMenuItem } from './menu-item';
import { SmMenuPositionX, SmMenuPositionY } from './menu-position';
import { filter, tap } from 'rxjs/operators';

export const Sm_MENU_SCROLL_STRATEGY =
    new InjectionToken<() => ScrollStrategy>('Sm_MENU_SCROLL_STRATEGY');

/**
 * Strategy scroll overlay
 * @param overlay
 */
export function Sm_MENU_SCROLL_STRATEGY_FACTORY(overlay: Overlay): () => ScrollStrategy {
    return () => overlay.scrollStrategies.reposition()
}

export const Sm_MENU_SCROLL_STRATEGY_FACTORY_PROVIDE = {
    provide: Sm_MENU_SCROLL_STRATEGY
    , deps: [Overlay]
    , useFactory: Sm_MENU_SCROLL_STRATEGY_FACTORY
};

const Sm_MENU_OFFSET_PADDING_TOP = 8;

export interface SmMenuTriggerBase {

    portal: TemplatePortal;

    overlayRef: OverlayRef;

    scrolStrategy: () => ScrollStrategy;

    menuOpen: boolean;

    menu: SmMenuPanel;

}
@Directive({
    selector: '[sm-menu-trigger], [SmMenuTriggerFor]'
    , host: {
        '(click)': '_handleClick($event)'
        , 'class': 'sm-menu-trigger'
    },
    exportAs: 'SmMenuTrigger'
})
export class SmMenuTriggerFor implements AfterContentInit, OnDestroy {


    portal: TemplatePortal;

    overlayRef: OverlayRef;

    private closeAction = Subscription.EMPTY;

    private hoverAction = Subscription.EMPTY;

    private menuClose = Subscription.EMPTY;

    private _hoverSubscription = Subscription.EMPTY;

    _menuOpen: boolean = this.menuOpen;

    scrolStrategy: () => ScrollStrategy;


    @Output() readonly menuOpened: EventEmitter<void> = new EventEmitter<void>();

    @Output() readonly menuClosed: EventEmitter<void> = new EventEmitter<void>();


    @Input('SmMenuTriggerFor')
    get menu() { return this._menu }

    set menu(menu: SmMenuPanel) {
        if (menu == this._menu)
            return;


        this._menu = menu;
        if (menu) {
            this.menuClose = menu.close.asObservable().subscribe(event => {
                // destroid menu panel
                this.resetActionMenu();
                if (event == 'click' && this._SmMenuParent)
                    this._SmMenuParent.closed.emit(event);
            })
        }
        this.closeAction.unsubscribe();
    }
    private _menu: SmMenuPanel;



    constructor(
        private elementRef: ElementRef<HTMLElement>,
        @Inject(Sm_MENU_SCROLL_STRATEGY) scrollStrategy: any,
        private _viewContainerRef: ViewContainerRef,
        @Optional() private _SmMenuParent: SmMenu,
        @Optional() @Inject(DOCUMENT) private _document: any
        , @Optional() @Self() private _menuItemInstance: SmMenuItem

        , private overlay: Overlay
    ) {
        if (_menuItemInstance)
            _menuItemInstance._triggersSubmenu = this.triggerSubmenu();

        this.scrolStrategy = scrollStrategy;

    }

    get menuOpen(): boolean {
        return this._menuOpen;
    }
    ngAfterContentInit() {
        this.validateMenuAfterOpen();
        this.handleHover();
    }
    ngOnDestroy() {
        this._closeMenu();
    }
    private _openMenu() {
        if (this.menuOpen)
            return;

        const overlayRef = this._createOverlay();
        const config = overlayRef.getConfig();
        this._setPosition(config.positionStrategy as FlexibleConnectedPositionStrategy);
        config.hasBackdrop = this.menu.hasBackdrop == null
            ? !this.triggerSubmenu()
            : this.menu.hasBackdrop
        overlayRef.attach(this._portalIntance())

        this.closeAction = this._closeMenuActions().subscribe(() => this._closeMenu());
        this._initializeMenu();

    }
    private _closeMenu() {
        
        this.menu.close.emit();
    }
    /**
     *  mapper submenu or top-level
     */
    triggerSubmenu(): boolean {

        return !!(this._menuItemInstance && this._SmMenuParent);
    }

    /** */
    private toogleMenu() {

        this.menuOpen ? this._closeMenu() : this._openMenu();

    }

    /** */
    private _initializeMenu() {

        this.menu.parentMenu = this.triggerSubmenu() ? this._SmMenuParent : undefined;
        this._updateStateMenuToggle(true);
    }

    /** */
    private _updateStateMenuToggle(value: boolean) {
        this._menuOpen = value;
        this._menuOpen ? this.menuOpened.emit() : this.menuClosed.emit();
        if (this.triggerSubmenu()) {
            this._menuItemInstance._highlighted = value;
        }
    }

    /** */
    private validateMenuAfterOpen() {
        if (!this.menu)
            throw new Error('The sm-menu is not valid, please validate this');
    }
    /**
     * listen click event in target mapper menu
     * @param event
     */
    _handleClick(event: MouseEvent) {        
        if (this.triggerSubmenu()) {
            event.stopPropagation();
            this._openMenu()
        } else {
            this.toogleMenu();
        }
    }

    handleHover() {
        if (!this.triggerSubmenu())
            return;
        this._SmMenuParent._hovered()
            .pipe(
                tap(e => {})
            ).subscribe(e => {})
    }
    private _createOverlay(): OverlayRef {

        if (!this.overlayRef) {
            const config = this._overlayConfig();
            this._watchPositionChange(config.positionStrategy as FlexibleConnectedPositionStrategy);
            this.overlayRef = this.overlay.create(config)

            this.overlayRef._keydownEvents.subscribe();
        }
        return this.overlayRef;
    }
    /**
     * create overlay config
     */
    private _overlayConfig(): OverlayConfig {
        return new OverlayConfig({
            backdropClass: this.menu.backdropClass || "cdk-overlay-transparent-backdrop"
            , scrollStrategy: this.scrolStrategy()
            , positionStrategy: this.overlay.position()
                .flexibleConnectedTo(this.elementRef)
                .withLockedPosition()
                .withTransformOriginOn('.sm-menu-panel, .sm-menu-mdc-panel')
        })
    }
    /**
     * listing the event change position component
     * @param position
     */
    private _watchPositionChange(position: FlexibleConnectedPositionStrategy): void {
        if (this.menu.updatePositionClass) {
            position.positionChanges.subscribe(_position => {
                const xPos: SmMenuPositionX = _position.connectionPair.overlayX === "start" ? 'after' : 'before';
                const yPos: SmMenuPositionY = _position.connectionPair.overlayY === "top" ? "below" : 'above';

                this.menu.updatePositionClass!(xPos, yPos);
            })
        }
    }
    private _setPosition(position: FlexibleConnectedPositionStrategy) {

        let [originX, originFallbackX]: HorizontalConnectionPos[] =
            this.menu.xPosition === 'before' ? ['end', 'start'] : ['start', 'end'];

        let [overlayY, overlayFallbackY]: VerticalConnectionPos[] =
            this.menu.yPosition === 'above' ? ['bottom', 'top'] : ['top', 'bottom'];

        let [originY, originFallbackY] = [overlayY, overlayFallbackY];
        let [overlayX, overlayFallbackX] = [originX, originFallbackX];
        let offsetY = 0;

        if (this.triggerSubmenu()) {
            // When the menu is a sub-menu, it should always align itself
            // to the edges of the trigger, instead of overlapping it.
            overlayFallbackX = originX = this.menu.xPosition === 'before' ? 'start' : 'end';
            originFallbackX = overlayX = originX === 'end' ? 'start' : 'end';
            offsetY = overlayY === 'bottom' ? Sm_MENU_OFFSET_PADDING_TOP : -Sm_MENU_OFFSET_PADDING_TOP;
        } else if (!this.menu.overlapTrigger) {
            originY = overlayY === 'top' ? 'bottom' : 'top';
            originFallbackY = overlayFallbackY === 'top' ? 'bottom' : 'top';
        }

        position.withPositions([
            { originX, originY, overlayX, overlayY, offsetY },
            { originX: originFallbackX, originY, overlayX: overlayFallbackX, overlayY, offsetY },
            {
                originX,
                originY: originFallbackY,
                overlayX,
                overlayY: overlayFallbackY,
                offsetY: -offsetY
            },
            {
                originX: originFallbackX,
                originY: originFallbackY,
                overlayX: overlayFallbackX,
                overlayY: overlayFallbackY,
                offsetY: -offsetY
            }
        ]);

    }

    private _closeMenuActions() {
        const backdrop = this.overlayRef!.backdropClick();
        const detachments = this.overlayRef!.detachments();
        const parentClose = this._SmMenuParent ? this._SmMenuParent.closed : of();
        const hover = this._SmMenuParent ? this._SmMenuParent._hovered()
            .pipe(
                filter(active => active != this._menuItemInstance)
                , filter(() => this._menuOpen)
            ) : of();

        return merge(backdrop, detachments, parentClose, hover);
    }

    private _portalIntance(): TemplatePortal {

        if (typeof this.portal === "undefined" || this.portal.templateRef != this.menu.templateRef)
            this.portal = new TemplatePortal(this.menu.templateRef, this._viewContainerRef);
        return this.portal;
    }
    private resetActionMenu() {
        if (!this.overlayRef && this.menuOpen)
            return;

        if (this.overlayRef === undefined) return;
        const menu = this.menu;

        this.closeAction.unsubscribe();
        this.overlayRef.detach();
        this._updateStateMenuToggle(false);

    }
}

// calculate x position
// calculate y position
