import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmMenuTriggerFor, Sm_MENU_SCROLL_STRATEGY_FACTORY_PROVIDE } from './menu-trigger';
import { SmMenuItem } from './menu-item';
import { SmMenu } from './menu';
import { OverlayModule } from '@angular/cdk/overlay'


@NgModule({
    exports: [SmMenuTriggerFor]
    , declarations: [SmMenuTriggerFor]
    , providers: [Sm_MENU_SCROLL_STRATEGY_FACTORY_PROVIDE]
})
// tslint:disable-next-line:class-name
export class _SmMenuDirectiveModule { }
@NgModule({
    imports: [
        CommonModule
        , OverlayModule
        , _SmMenuDirectiveModule
    ]
    , exports: [SmMenu, SmMenuItem, _SmMenuDirectiveModule]
    , declarations: [SmMenu, SmMenuItem]
    , providers: [Sm_MENU_SCROLL_STRATEGY_FACTORY_PROVIDE]
})
export class SmMenuModule { }
