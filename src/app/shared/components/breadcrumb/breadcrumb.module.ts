import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SmButtonModule } from '../button/button.module';
import { SmIconModule } from '../icon/icon.module';
import { Breadcrumb } from './breadcrumb';

@NgModule({
    imports: [CommonModule, RouterModule, SmButtonModule, SmIconModule]
    , declarations:[Breadcrumb]
    , exports: [Breadcrumb]
})
export class SmBreadcrumbModule {}