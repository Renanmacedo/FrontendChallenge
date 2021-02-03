import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SmRipple } from './ripple';

@NgModule({
  imports: [CommonModule],
  declarations: [SmRipple],
  exports: [SmRipple]
})
export class SmRippleModule {}
