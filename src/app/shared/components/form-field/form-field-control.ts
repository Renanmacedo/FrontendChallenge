import { Directive } from '@angular/core';
import { Subject } from 'rxjs';


@Directive({ selector: '[]' })
// tslint:disabled-next-line
export class SmFormFieldControl<T> {

    focused: boolean;

    empty: boolean;

    stateChange: Subject<void>;

    keepFloatLabel: boolean;
}
