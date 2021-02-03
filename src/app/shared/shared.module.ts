import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
    SmButtonModule
    , SmCardModule
    , SmFormFieldModule
    , SmIconModule
    , SmInputModule
    , SmMenuModule
    , SmOptionModule
    , SmRippleModule
    , SmSelectModule
    , SmToggleModule
    , SmHeaderModule
    , SmNavMenuModule
} from './index';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { NgxMaskModule } from 'ngx-mask';
@NgModule({
    imports: [
        CommonModule
        , SmCardModule
        , SmButtonModule
        , SmIconModule
        , FormsModule
        , ReactiveFormsModule
        , SmFormFieldModule
        , SmInputModule
        , SmOptionModule
        , SmSelectModule
        , SmMenuModule
        , SmToggleModule
        , SmRippleModule
        , SmHeaderModule
        , SmNavMenuModule
        
    ]
    , exports: [
        SmCardModule
        , SmButtonModule
        , FormsModule
        , ReactiveFormsModule
        , SmIconModule
        , SmFormFieldModule
        , SmInputModule
        , SmOptionModule
        , SmSelectModule
        , SmToggleModule
        , SmMenuModule
        , SmRippleModule
        , SmHeaderModule
        , SmNavMenuModule

    ]
    , declarations: []
    , entryComponents: []
})
export class SharedModule { }