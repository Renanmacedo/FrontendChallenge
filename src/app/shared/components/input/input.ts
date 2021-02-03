import {
    Directive
    , ElementRef
    , Optional
    , HostListener
    , Input
    , OnInit
    , DoCheck,
    AfterContentInit,
    Self,
    OnChanges,
    SimpleChanges,
    forwardRef
} from '@angular/core';
import {
    ControlValueAccessor
    , NgControl
    , NgForm
    , FormGroupDirective

} from '@angular/forms';
import { Subject } from 'rxjs';


@Directive({
    selector: 'input[SmInput], textarea[SmInput]',
    exportAs: 'SmInput'
    , host: {
        'class': 'sm-input-fill-element'
        , '[class.sm-input-disable]': 'disabled'
    }

})
export class SmInput implements ControlValueAccessor, OnInit, DoCheck, AfterContentInit, OnChanges {


    @Input()
    get placeholder() { return this._placeholder }
    set placeholder(value: string) {
        this._placeholder = value
    }
    _placeholder: string;

    @Input()
    get value() { return this._value }
    set value(value: any) {
        
        this._value = value;
        this.updateValue();
    }
    private _value: any;

    @Input()
    get type() { return this._type };
    set type(value: string) {
        this._type = value || "text";
        this.validateType();
        (this.elementRef.nativeElement as HTMLInputElement).type = this._type;
    }
    private _type: string = "text";

    @Input()
    get id() { return this._id };
    set id(value: any) { this._id = value }
    private _id: any;
    readonly stateChange: Subject<void> = new Subject<void>();

    focused: boolean = false;

    controlType = 'input';

    private disabled: boolean;

    onChange: (value?: any) => void;
    onTouched: (value?: any) => void;

    constructor(
        private elementRef: ElementRef<HTMLInputElement | HTMLTextAreaElement>
        , @Optional() @Self() public ngControl: NgControl
        , @Optional() public parentForm: NgForm
        , @Optional() public formDirective: FormGroupDirective
    ) { }

    ngOnChanges(changes: SimpleChanges): void { }


    ngDoCheck() {
        if (this.ngControl)
            this.ngControl.valueAccessor = this;

        
    }
    ngAfterContentInit() { }

    ngOnInit() {
        this.stateChange.next();

    }

    @HostListener('focus', ['$event']) focus($event) {
        if (this.disabled) return;
        this.focused = !this.focused
        this.stateChange.next();
    };

    @HostListener('blur', ['$event']) blur($event) {
        if (this.disabled) return;
        this.focused = !this.focused
        this.stateChange.next();
    };

    get empty(): boolean {
        
        return !this.elementRef.nativeElement.value;
    }
    get keepFloatLabel(): Boolean {
        return this.focused || !this.empty;
    }
    get _disable() {
        return this.disabled;
    }
    private _initializeSelect() {
        this.elementRef.nativeElement.value = (this.ngControl) ? this.ngControl.control.value : null;
    }
    private validateType() {
        if (!!~["date", "week", "datetime-local", "time", "week"].indexOf(this._type))
            throw new Error(`The SmInput not suported the type: ${this._type}`)
    }
    writeValue(obj: any): void {
        this._value = obj;
        this.updateValue();
    }

    registerOnChange(fn: any) { this.onChange = fn }

    registerOnTouched(fn: any): void { this.onTouched = fn }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
    private updateValue() {
        this.elementRef.nativeElement.setAttribute('value', this._value);
        // this.elementRef.nativeElement.value = this._value;
    }
}
