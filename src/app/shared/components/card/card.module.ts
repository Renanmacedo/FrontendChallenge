import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    SmCard
    , SmCardHeader
    , SmCardBody
    , SmCardFotter
    , SmCardTitle
    , SmCardSubtitle
} from './card';

const _declarations = [
    SmCard
    , SmCardBody
    , SmCardHeader
    , SmCardFotter
    , SmCardSubtitle
    , SmCardTitle
]
@NgModule({
    imports: [CommonModule]
    , exports: _declarations
    , declarations: _declarations
})
export class SmCardModule { }
