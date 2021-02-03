import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmButton, SmFloatButton } from './button';
import { SmRippleModule } from '../ripple/ripple.module';

@NgModule({
    imports: [CommonModule,  SmRippleModule]
    , declarations: [SmButton, SmFloatButton]
    , exports: [SmButton, SmFloatButton]
})
export class SmButtonModule { }
