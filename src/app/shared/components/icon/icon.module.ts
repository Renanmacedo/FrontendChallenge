import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmIcon } from './icon';

const _declarations = [SmIcon]

@NgModule({
    imports: [CommonModule]
    , exports: _declarations
    , declarations: _declarations
})
export class SmIconModule { }
