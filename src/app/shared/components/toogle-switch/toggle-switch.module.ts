import { CommonModule } from '@angular/common';
import { forwardRef, NgModule } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SmToggleSwitch} from './toggle-switch'
@NgModule({
    imports: [CommonModule]
    , declarations: [SmToggleSwitch]
    , exports: [SmToggleSwitch]
    ,  providers: [
        {
            provide: NG_VALUE_ACCESSOR
            , useExisting: forwardRef(() => SmToggleSwitch)
            , multi: true
        }
    ],
})
export class SmToggleModule {}