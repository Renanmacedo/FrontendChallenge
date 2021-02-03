import {
    Component
    , ViewEncapsulation
    , ChangeDetectionStrategy
    , InjectionToken
    , OnDestroy
    , AfterViewChecked
    , Optional
    , Inject
    , ElementRef
    , ChangeDetectorRef
    , Input
    , Output
    , EventEmitter
} from '@angular/core';
import { Subject } from 'rxjs';



export interface SmOptionModelChanges {
    own: SmOption
    userInput: boolean
}

export const Sm_OPTION_INJECTION =
    new InjectionToken<{ multiple: boolean }>('Sm_OPTION_INJECTION');

let uniqueId = 0;

@Component({
    selector: 'sm-option,'
    , templateUrl: './option.html'
    , encapsulation: ViewEncapsulation.None
    , changeDetection: ChangeDetectionStrategy.OnPush
    , exportAs: 'SmOption'
    , host: {
        'class': 'sm-option'
        , '(click)': 'selectByClick()'
        , '[attr.id]': 'id'
    }
})
export class SmOption implements AfterViewChecked, OnDestroy {

    @Input() value: any;

    @Input() id: string = `sm-option-${uniqueId++}`;

    optionModel: any = { multiple: false };
    /**  */
    _active: boolean;
    /** */
    _disabled: boolean;
    /** */
    _select: boolean = false;

    multiple: boolean;

    moreOneSelect: boolean = false;

    /** */
    readonly _stateChange = new Subject<void>();

    @Output() readonly onSelectionChange = new EventEmitter<SmOptionModelChanges>();
    
    constructor(
        private elementRef: ElementRef<HTMLElement>
        , @Optional() @Inject(Sm_OPTION_INJECTION) private _option: any
        , private changeDetection: ChangeDetectorRef
    ) { }

    ngAfterViewChecked() {
        // initialize option
        this.optionModel = this._option;
        if (this._select) {

        }
    }

    ngOnDestroy() {
        this._stateChange.complete();

    }

    get selected() {
        return this._select
    };
    select() {
        if (!this.selected) {

            this._select = true;
            this.changeDetection.markForCheck();
            this.notifyChangeOption();
        }
    }

    deselect() {
        if (this.selected) {
            this._select = false;
            this.changeDetection.markForCheck();
            this.notifyChangeOption();
        }
    }

    selectByClick() {
        this._select = true;
        this.changeDetection.markForCheck();
        this.notifyChangeOption();
    }

    notifyChangeOption() {


        this.onSelectionChange.emit({ own: this, userInput: true });

    }

    _host() {
        return this.elementRef.nativeElement;
    }
}
