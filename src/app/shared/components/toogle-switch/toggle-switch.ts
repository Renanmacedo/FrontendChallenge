import { Component, Input, ChangeDetectorRef, ChangeDetectionStrategy, Output, EventEmitter, forwardRef, ViewChildren, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'toggle-switch, [toggle-switch]'
    , template: `
        <label class="sm-toggle">
            <input
                #toggleInput
                type="checkbox" 
                class="sm-toggle-checkbox" 
                [checked]="checked" 
                [attr.id]="id" 
                [disabled]="disabled"
                (change)="_onChangeEvent($event)"
            />
            <div class="sm-toggle-switch"></div>
            <ng-content></ng-content>
        </label>
    `
    , changeDetection: ChangeDetectionStrategy.Default
    , styleUrls: ['./toggle-switch.scss']
    , host: { '[class.sm-toggle-switch-disbled]': '_disabled' },
    encapsulation: ViewEncapsulation.None
})
export class SmToggleSwitch implements ControlValueAccessor {


    private unikId: string = 'toggle-switch-1';

    @ViewChild('toggleInput', { static: true }) _inputElement: ElementRef<HTMLInputElement>;
    @Input() id: string = this.unikId;

    /** */
    @Input()
    get checked() { return this._checked };
    set checked(value) {
        this._checked = !!value;
        this.changeDetection.markForCheck();
    }
    private _checked: boolean;

    /** */
    @Input()
    get disabled() { return this._disabled };
    set disabled(value) {
        this._disabled = !!value
        this.changeDetection.markForCheck();
    }

    private _disabled: boolean = false

    /** */
    @Output() toogleChange: EventEmitter<any> = new EventEmitter<any>();

    /** */
    @Output() clickEvent: EventEmitter<any> = new EventEmitter<any>();

    /** */
    _onChange: () => {}

    /** */
    _onTouchedChange: () => {}

    constructor(
        private changeDetection: ChangeDetectorRef
    ) { }

    _onChangeEvent(event: Event) {
        event.stopPropagation();
        if(!this._disabled)
            this.toogleChange.emit(this._inputElement.nativeElement.checked);

    }

    writeValue(value: any): void {
        if (!this.disabled)
            this._checked = !!value
    }

    registerOnChange(fn: any): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this._onTouchedChange = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}