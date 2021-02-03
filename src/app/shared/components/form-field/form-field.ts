import { Component, ChangeDetectionStrategy, ViewEncapsulation, Input, ElementRef, AfterContentInit, Directive, ContentChild, ContentChildren, ChangeDetectorRef, QueryList } from '@angular/core';
import { SmInput } from '../input/input';
import { startWith } from 'rxjs/operators';
import { SmSelect } from '../select/select';
import { NgControl } from '@angular/forms';
import { errorMessageAnimation } from '../../../helpers/animation';
@Directive({ selector: 'sm-label, [SmLabel]' })
export class SmLabel { }

@Directive({ selector: 'sm-error, [SmError]', host: { 'class': 'sm-form-field-error' } })
export class SmError { }

@Component({
    selector: 'sm-form-field , [sm-form-field]'
    , exportAs: 'SmFormField'
    , templateUrl: './form-field.html'
    , changeDetection: ChangeDetectionStrategy.Default
    , encapsulation: ViewEncapsulation.None
    , host: {
        'class': 'sm-form-field'
        , '[class.sm-form-field-focused]': '_control.focused'
        , '[class.sm-form-field-keep-label-float]': '_control.keepFloatLabel'
        , '[class.sm-form-field-no-label]': '!hasLabel()'
        , '[class.sm-disable-container]': '_control._disable'
        , '[class.sm-form-field-invalid]': 'errorState()'
        , '[class.ng-untouched]': 'isErrorState("untouched")'
        , '[class.ng-touched]': 'isErrorState("touched")'
        , '[class.ng-pristine]': 'isErrorState("pristine")'
        , '[class.ng-dirty]': 'isErrorState("dirty")'
        , '[class.ng-valid]': 'isErrorState("valid")'
        , '[class.ng-invalid]': 'isErrorState("invalid")'
        , '[class.ng-pending]': 'isErrorState("pending")'
    },
    animations: [errorMessageAnimation]
})
export class SmFormField implements AfterContentInit {
    uniqueId: string;
    @Input()
    get view() {
        return this._view;
    }
    set view(value: string) {
        this._view = value
    }
    _view: string = "inline"
    _stateMessageError: string = '';
    @ContentChildren(SmInput) _controlNonStatic: SmInput;

    @ContentChild(SmInput, { static: true }) _controlInputStatic: SmInput;
    @ContentChildren(SmError, { descendants: true }) _SmError: QueryList<SmError>;

    @ContentChild(SmSelect, { static: true }) _controlNonStaticSelect: SmSelect;

    @ContentChild(SmLabel, { static: true }) _SmLabelStatic: SmLabel;

    // @ContentChild(SmFloatButton, { static: true }) _SmFloat: SmFloatButton;
    constructor(
        private elementRef: ElementRef
        , private changeRef: ChangeDetectorRef
    ) { }

    ngAfterContentInit() {
        this._stateMessageError = 'enter';
        this._control.registerOnChange
        if (this._control.controlType)
            this.elementRef.nativeElement.classList.add(`sm-form-field-type-${this._control.controlType}`)

        this.elementRef.nativeElement.classList.add(`sm-form-field-${this._view}`)

        if (typeof this._control.stateChange !== "undefined") {
            this._control.stateChange.pipe(startWith(null!))
                .subscribe(e => this.changeRef.markForCheck());
        }
        console.log(this._control.empty);

    }
    get _labelStatic() {
        return this._SmLabelStatic;
    }

    hasLabel() {
        return typeof this._SmLabelStatic !== "undefined";
    }
    get _control() {
        return this._controlInputStatic || this._controlNonStaticSelect;
    }

    isErrorState(prop: keyof NgControl) {
        return this._control.ngControl ? this._control.ngControl[prop] : null;
    }
    errorState() {
        return !!(this._control.ngControl && this._control.ngControl.invalid && (this._control.ngControl.touched || (this._control.parentForm && this._control.parentForm.submitted)))
    }

    getStateMessage() {
        return this._SmError && this._SmError.length > 0 && this.errorState();
    }
}
