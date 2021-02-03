import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmNavMenu } from './nav-menu';
import { SmNavMenuItem } from './nav-menu-item'
import { SmIconModule } from '../icon/icon.module';
import { SmNavMenuTigger } from './nav-menu-tigger';
import { RouterModule } from '@angular/router';
const _declarations = [
    SmNavMenu
    , SmNavMenuItem
    , SmNavMenuTigger
]
@NgModule({
    imports: [
        CommonModule
        , SmIconModule
        , RouterModule
    ]
    , exports: _declarations
    , declarations: _declarations
})
export class SmNavMenuModule { }
