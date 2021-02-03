import { NgModule } from '@angular/core';
import { SmError, SmFormField, SmLabel } from './form-field';
import { CommonModule } from '@angular/common';
import { SmFormFieldControl } from './form-field-control';



@NgModule({
    imports: [
        CommonModule
    ]
    , declarations: [
        SmFormField
        , SmLabel
        , SmFormFieldControl
        , SmError
    ]
    , exports: [
        SmFormField
        , SmLabel
        , SmFormFieldControl
        , SmError
    ]
})
export class SmFormFieldModule { }
