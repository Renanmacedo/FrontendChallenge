import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SmHeader, SmHeaderTemplate } from './header';

const _declaration = [SmHeader, SmHeaderTemplate]

@NgModule({
    imports: [CommonModule]
    , declarations: _declaration
    , exports: _declaration
})
export class SmHeaderModule { }
