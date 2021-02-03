import { InjectionToken, TemplateRef, EventEmitter } from '@angular/core';
import { SmMenuPositionX, SmMenuPositionY } from './menu-position';



export const Sm_MENU_PANEL = new InjectionToken<SmMenuPanel>('sm-menu-panel');

/** Panel interface that provide values in sm-menu */
export interface SmMenuPanel<T = any> {

    xPosition:SmMenuPositionX;

    yPosition: SmMenuPositionY;

    backdropClass: string;

    hasBackdrop: boolean;

    updatePositionClass: (x: SmMenuPositionX, y: SmMenuPositionY) => void;

    templateRef: TemplateRef<any>;

    close: EventEmitter<void | 'click'>;

    readonly parentId?: string;

    parentMenu: SmMenuPanel | undefined;

    overlapTrigger?: boolean;


}
