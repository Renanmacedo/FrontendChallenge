import { forwardRef, NgModule } from '@angular/core';
import { SmInput } from './input';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@NgModule({
    imports: []
    , exports: [SmInput]
    , declarations: [SmInput]
    , providers: [{
        provide: NG_VALUE_ACCESSOR
        , useExisting: forwardRef(() => SmInput)
        , multi: true
    }]
})
export class SmInputModule { }
