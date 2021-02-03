import { NgModule } from '@angular/core';
import { SmSelect, Sm_SELECT_SCROOL_PROVIDE } from './select';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { SmOptionModule } from '../option/option.module';

@NgModule({
    imports: [
        CommonModule
        , OverlayModule
        , SmOptionModule
    ]
    , exports: [SmSelect, SmOptionModule]
    , declarations: [SmSelect]
    , providers: [{
        provide: NG_VALUE_ACCESSOR
        , useExisting: SmSelect
        , multi: true
    },
        Sm_SELECT_SCROOL_PROVIDE
    ]
})
export class SmSelectModule { }
