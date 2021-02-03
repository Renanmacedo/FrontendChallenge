import { NgModule } from '@angular/core';
import {
    SmSidemenu
    , SmSidemenuContainer
    , SmSidemenuContent
    , SmSideContent
} from './sidemenu';
import { CommonModule } from '@angular/common';
import { SmIconModule } from '../icon/icon.module';
import { SmButtonModule } from '../button/button.module';


const _declarations = [
    SmSidemenu
    , SmSidemenuContainer
    , SmSideContent
    , SmSidemenuContent
];
@NgModule({
    imports: [
        CommonModule
        , SmIconModule
        , SmButtonModule
    ]
    , exports: _declarations
    , declarations: _declarations
    , providers: []
})
export class SmSidemenuModule { }
