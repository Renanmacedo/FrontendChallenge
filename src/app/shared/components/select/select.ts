import {
    Component
    , ViewEncapsulation
    , ChangeDetectionStrategy
    , Optional
    , Self
    , ElementRef
    , Input
    , InjectionToken
    , ContentChildren
    , QueryList
    , AfterContentInit
    , OnDestroy
    , OnInit
    , ViewChild
    , Inject
    , Output
    , EventEmitter
    , ChangeDetectorRef
} from '@angular/core';
import { ControlValueAccessor, NgControl, NgForm, FormGroupDirective } from '@angular/forms'
import { Subject, defer, Observable, merge } from 'rxjs';
import { take } from 'rxjs/operators';
import {
    OverlayRef
    , Overlay
    , ScrollStrategy
    , ConnectedPosition
    , CdkConnectedOverlay
    , ViewportRuler,
    ConnectionPositionPair
} from '@angular/cdk/overlay';
import { SmOption, SmOptionModelChanges } from '../option/option';
import { takeUntil, startWith, switchMap } from 'rxjs/operators';

export const Sm_SELECT_SCROOL_STRATEGY =
    new InjectionToken<() => ScrollStrategy>('SM_SELECT_SCROLL_STRATEGY');


/** @docs-private */
export function Sm_SELECT_SCROLL_STRATEGY_PROVIDER_FACTORY(overlay: Overlay):
    () => ScrollStrategy {
    return () => overlay.scrollStrategies.reposition();
}
export const Sm_SELECT_SCROOL_PROVIDE = {
    provide: Sm_SELECT_SCROOL_STRATEGY
    , deps: [Overlay]
    , useFactory: Sm_SELECT_SCROLL_STRATEGY_PROVIDER_FACTORY
}

// height select panel
const Sm_SELECT_PANEL_HEIGHT = 256;
// offset panel where the empty value;
const Sm_OFFSET_PANEL_DEFAULT = 0;

@Component({
    selector: 'sm-select, [sm-select]'
    , templateUrl: './select.html'
    , exportAs: 'SmSelect'
    , encapsulation: ViewEncapsulation.None
    , changeDetection: ChangeDetectionStrategy.Default
    , host: {
        'role': 'combobox'
        , 'class': 'sm-select'
        , '(focus)': '_handleFocus($event)'
        , '[class.sm-select-disable]': 'disabled'
    }
})
export class SmSelect implements ControlValueAccessor, OnInit, AfterContentInit, OnDestroy {
    private _scrollStrategyFactory: () => ScrollStrategy;

    private _panelOpened: boolean;

    _placeholder: string = null;
    /** value prev before change */
    _prevValue: string = null;
    /** element focused is true, where bluer is false */
    _multiple: boolean = false;

    focused: boolean = false;

    _scrollStrategy: ScrollStrategy;

    _positions: ConnectedPosition[];

    _triggerRect: ClientRect;

    controlType: string = 'select';

    private _offsetY: number = 0;
    private _scrollY: number = 0;

    /** change component */
    readonly stateChange: Subject<void> = new Subject<void>();

    overlayRef: OverlayRef;

    _SmOption: SmOption | null;

    _fontSizeBox: number = 0;

    /**
     * create an observable when the change is update on Option
     */
    onOptionChangeModelEvent: Observable<SmOptionModelChanges> = defer(() => {
        const options = this._allOptions;
        if (options) {
            return options.changes.pipe(
                startWith(options)
                , switchMap(() => merge(...options.map(option => option.onSelectionChange)))
            );
        }
    }) as Observable<SmOptionModelChanges>;


    private readonly _destroy = new Subject<void>();

    @Input()
    get placeholder() { return this._placeholder }
    set placeholder(value: string) { this._placeholder = value; };

    @Input()
    get required() { return this._required }
    set required(value: any) {
        this._required = value;
    }
    _required: Boolean;

    @Input()
    get searchFn() { return this._searchFn }
    set search(fn: (term: any) => any) {
        this._searchFn = fn;
    }
    @Input()
    get multiple() { return this._multiple };
    set multiple(value: boolean) {

        this._multiple = value;

    }
    @Input()
    get value() { return this._value }
    set value(value: any) {
        this.writeValue(value);
        this._value = value;
    }
    @Input()
    get groupBy() { return this._groupBy }
    set groupBy(group: any) {
        this._groupBy = group;
    }
    private _groupBy: any = null;

    _value: any;

    @ContentChildren(SmOption, { descendants: true }) _allOptions: QueryList<SmOption>;

    @ViewChild(CdkConnectedOverlay, { static: true }) _overlayOrigin: CdkConnectedOverlay;

    @ViewChild('panel', { static: true }) _panelElement: ElementRef<HTMLElement>;

    @ViewChild('boxElement', { static: true }) _boxElement: ElementRef<HTMLElement>;

    @Output() opened: EventEmitter<any> = new EventEmitter<any>();

    @Output() closed: EventEmitter<any> = new EventEmitter<any>();

    @Output() readonly onSelectChange: EventEmitter<any> = new EventEmitter<any>();

    optionModel: SmOption;

    listOptions: Set<SmOption>;

    _selected: SmOption[] | null;

    private disabled: boolean;

    _onTouched: () => void;

    _onChange: (value: any) => void = () => { };


    constructor(
        @Optional() @Self() public ngControl: NgControl
        , private elementRef: ElementRef<HTMLElement>
        , @Optional() private overlay: Overlay
        , @Optional() public parentForm: NgForm
        , @Optional() public formDirective: FormGroupDirective
        , private viewPort: ViewportRuler
        , @Inject(Sm_SELECT_SCROOL_STRATEGY) scrollStrategyFactory: any
        , private changeDetectionRef: ChangeDetectorRef

    ) {
        this._scrollStrategyFactory = scrollStrategyFactory;
        this._scrollStrategy = this._scrollStrategyFactory();
        if (this.ngControl)
            this.ngControl.valueAccessor = this;
    }
    _handleFocus($events) {}
    get empty(): boolean {
        return this.listOptions.size === 0;
    }

    get keepFloatLabel(): boolean {

        return this.focused || !this.empty;
    }

    get panelOpen() {
        return this._panelOpened;
    }
    /**
     *
     */
    get selected(): SmOption {
        return this.optionSelected[0];
    }
    get viewValue(): string {
        if (this.empty)
            return "";
        return this.optionSelected[0]._host().textContent;
    }

    get optionSelected() {
        if (!this._selected) {
            this._selected = Array.from(this.listOptions.values());
        }
        return this._selected;
    }
    ngOnInit() {
        this.listOptions = new Set<SmOption>();
        this.stateChange.next();
    }

    ngAfterContentInit() {

        // multiple event subscribe
        this.onOptionChangeModelEvent.pipe(takeUntil(this._destroy))
            .subscribe(event => {
                if (event.userInput) {
                    this.optionModel = event.own;

                }
            })
        this._allOptions.changes.pipe(startWith(null), takeUntil(this._destroy))
            .subscribe(() => {
                this.resetOptions();
                this._initializeSelect();
            })
    }

    ngOnDestroy() {
        this._destroy.complete();
    }
    /**
     * initialize chance events in option inside select
     */
    resetOptions() {

        const changeDestroid = merge(this._allOptions.changes, this._destroy);

        this.onOptionChangeModelEvent.pipe(
            takeUntil(changeDestroid))
            .subscribe(event => {
                this._onSelect(event.own, event.userInput);

                if (event.userInput && this.panelOpen) {
                    this.close();
                    this.focus();
                }
            });
        merge(...this._allOptions.map((option) => option._stateChange))
            .pipe(takeUntil(changeDestroid))
            .subscribe(() => {
                this.changeDetectionRef.markForCheck();
                this.stateChange.next();
            })
    }
    /**
     * reset select
     */
    _onSelect(option: SmOption, isInput: Boolean) {


        const hasSelect = this._isSelected(option);
        if (option.value == null) {
            option.deselect();
            this.notifyPropagate(option.value);
            this.listOptions.clear();

        } else {
            if (hasSelect !== option.selected) {
                this.listOptions.clear();
                this._selected = null;
                option.selected ? this.listOptions.add(option)
                    : this.listOptions.delete(option);
            }

            if (isInput) {
                this.focus();
            }
            if (hasSelect !== this._isSelected(option)) {
                this.notifyPropagate();
            }
        }
        this.stateChange.next();
    }
    private _isSelected(option: SmOption) {
        return this.listOptions.has(option);

    }
    focus(options?: FocusOptions) {

        this.elementRef.nativeElement.focus(options);
    }
    /**
     * define selection by value
     */
    _initializeSelect() {
        Promise.resolve().then(() => {
            this._selectionByValue(this.ngControl ? this.ngControl.value : this._value);
            this.stateChange.next();
        })
    }

    /**
     * select option by value
     */
    _selectionByValue(value: any) {

        this.listOptions.clear(); // reset list options

        // implement multiplay values
        const option = this._getValue(value); // select via keymanager

        this.changeDetectionRef.markForCheck();

    }

    private _getValue(value: any): SmOption {
        const sameOption = this._allOptions.find(option => {
            return option.value != null && option.value === value;
        });

        if (sameOption)
            this.listOptions.add(sameOption);
            
        return sameOption;
    }
    _onAttached() {
        this._overlayOrigin.positionChange.pipe(take(null))
            .subscribe(() => {
                this.changeDetectionRef.detectChanges();
                // positions
            })

    }

    /** */
    toggle() {

        this._panelOpened ? this.close() : this.open();
    }

    /**
     * open the overlay with options
    */
    open() {

        if (this._panelOpened || !this._allOptions || !this._allOptions.length)
            return;

        this._panelOpened = true;
        this._triggerRect = this._boxElement.nativeElement.getBoundingClientRect();

        this._fontSizeBox = parseInt(this._boxElement.nativeElement.style.fontSize) || 0;

        this.focused = true;
        this._calculateOverlayWidth();
        this.changeDetectionRef.markForCheck();
    }
    /**  */
    close() {
        if (!this._panelOpened)
            return;

        this._panelOpened = false;
        this.focused = false;
    }
    /**
     *
    */
    notifyPropagate(fallbackValue?: any) {
        let valueEmmit: any = null;
        valueEmmit = this.selected ? (this.selected as SmOption).value : fallbackValue;
        this._value = valueEmmit;
        this.onSelectChange.emit(valueEmmit);
        this._onChange(valueEmmit);
        this.changeDetectionRef.markForCheck();

    }
    /**
     *
     */
    _searchFn: (term) => {}

    private _calculateOverlayWidth() {

        const clientHeight = this._clientHieght();
        const panelHeight = Math.min(clientHeight, Sm_SELECT_PANEL_HEIGHT);
        const scrollPanel = clientHeight - panelHeight;
        const selectedOptionOffset = this.listOptions.size || 0;

    }

    _getPosition() {
        this._positions = [
            new ConnectionPositionPair(
                { originX: 'start', originY: 'bottom' },
                { overlayX: 'start', overlayY: 'top' }
            ),
            new ConnectionPositionPair(
                { originX: 'start', originY: 'top' },
                { overlayX: 'start', overlayY: 'bottom' }
            )
        ]
    }

    _clientHieght() {
        return this._fontSizeBox.valueOf() * 3;
    }
    writeValue(obj: any): void {
        if (this._allOptions) {
            this._value = obj;
        }
    }

    registerOnChange(fn: any): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this._onTouched = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }


}
